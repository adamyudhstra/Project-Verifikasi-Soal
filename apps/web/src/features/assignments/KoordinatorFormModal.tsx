import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateKoordinatorAssignment } from '../../hooks/useAssignments';
import { useCourses, useSemesters } from '../../hooks/useMasterData';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/axios';

const schema = z.object({
  course_id: z.coerce.number().min(1, 'Course is required'),
  semester_id: z.coerce.number().min(1, 'Semester is required'),
  user_id: z.coerce.number().min(1, 'User is required'),
});

type FormValues = z.infer<typeof schema>;

interface KoordinatorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KoordinatorFormModal = ({ isOpen, onClose }: KoordinatorFormModalProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const createMutation = useCreateKoordinatorAssignment();

  // Fetch all options without pagination for dropdowns (or use a high per_page)
  const { data: coursesData } = useCourses(1, 1000);
  const { data: semestersData } = useSemesters(1, 100);
  
  // We need users with role KOORDINATOR. We don't have a specific master data endpoint,
  // but let's assume we can fetch them via a simple call, or we might need to hardcode a fetch
  // Wait, the API contract doesn't have `/users` exposed. Let's check how we can get users.
  // The assignment says "Untuk option data, manfaatkan existing Master Data React Query hooks bila memungkinkan".
  // Since we need `user_id`, and we don't have `/users` endpoint in the contract, let's create a custom fetch here 
  // or just use a standard text input if we don't have a users endpoint. Wait! We can fetch from `/dosens?with_user=1` 
  // and map those who have `user.role === 'KOORDINATOR'`. 
  // Let's use `useDosens(1, 1000, true)`
  const { data: dosensData } = useQuery({
    queryKey: ['dosens', { page: 1, perPage: 1000, withUser: true }],
    queryFn: async () => {
      const res = await apiClient.get('/dosens', { params: { page: 1, per_page: 1000, with_user: 1 } });
      return res.data;
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      await createMutation.mutateAsync(data);
      reset();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          Object.keys(validationErrors).forEach((key) => {
            setError(key as any, {
              type: 'server',
              message: validationErrors[key][0],
            });
          });
        } else {
          setServerError(error.response.data.message || 'Validation error.');
        }
      } else if (error.response?.status === 409) {
        setServerError(error.response.data.message || 'Assignment conflict.');
      } else if (error.response?.status === 403) {
        setServerError('You do not have permission to perform this action.');
      } else {
        setServerError('Failed to create assignment.');
      }
    }
  };

  const koordinatorUsers = dosensData?.data
    ?.filter((d: any) => d.user && d.user.role === 'KOORDINATOR')
    .map((d: any) => d.user) || [];

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4" id="modal-title">
                  Add Koordinator Assignment
                </h3>
                
                {serverError && (
                  <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
                    <p className="text-sm text-red-700">{serverError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register('course_id')}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a course...</option>
                      {coursesData?.data.map((course: any) => (
                        <option key={course.id} value={course.id}>
                          {course.course_code} - {course.course_name}
                        </option>
                      ))}
                    </select>
                    {errors.course_id && <p className="mt-1 text-sm text-red-600">{errors.course_id.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register('semester_id')}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a semester...</option>
                      {semestersData?.data.map((semester: any) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.name}
                        </option>
                      ))}
                    </select>
                    {errors.semester_id && <p className="mt-1 text-sm text-red-600">{errors.semester_id.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Koordinator (User ID)</label>
                    {koordinatorUsers.length > 0 ? (
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('user_id')}
                        disabled={isSubmitting}
                      >
                        <option value="">Select a user...</option>
                        {koordinatorUsers.map((user: any) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        placeholder="Enter User ID directly"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('user_id')}
                        disabled={isSubmitting}
                      />
                    )}
                    {errors.user_id && <p className="mt-1 text-sm text-red-600">{errors.user_id.message}</p>}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  disabled={isSubmitting}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
