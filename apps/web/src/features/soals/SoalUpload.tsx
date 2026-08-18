import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUploadSoal } from '../../hooks/useSoals';
import { useCourses, useSemesters } from '../../hooks/useMasterData';
import { ArrowLeft } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const schema = z.object({
  course_id: z.coerce.number().min(1, 'Mata kuliah wajib dipilih'),
  semester_id: z.coerce.number().min(1, 'Semester wajib dipilih'),
  exam_category: z.string().min(1, 'Kategori ujian wajib dipilih'),
  file: z
    .any()
    .refine((files) => files?.length == 1, 'File dokumen wajib diunggah')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'Ukuran maksimal file adalah 10MB')
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'Format file harus berupa .pdf, .doc, atau .docx'
    ),
});

type FormValues = z.infer<typeof schema>;

export const SoalUpload = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { data: coursesData } = useCourses(1, 1000);
  const { data: semestersData } = useSemesters(1, 100);
  const uploadMutation = useUploadSoal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append('course_id', data.course_id.toString());
      formData.append('semester_id', data.semester_id.toString());
      formData.append('exam_category', data.exam_category);
      formData.append('file', data.file[0]);

      await uploadMutation.mutateAsync(formData);
      navigate('/koordinator/soals');
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
        setServerError(error.response.data.message || 'Soal sudah berstatus APPROVED dan tidak dapat diunggah ulang.');
      } else if (error.response?.status === 403) {
        setServerError('Anda bukan Koordinator untuk mata kuliah ini pada semester terpilih.');
      } else {
        setServerError('Gagal mengunggah soal.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/koordinator/soals')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Unggah Soal Baru</h2>
          <p className="mt-1 text-sm text-gray-500">
            Formulir untuk mengunggah berkas soal ujian. Pastikan format sesuai template.
          </p>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {serverError && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mata Kuliah</label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...register('course_id')}
                disabled={isSubmitting}
              >
                <option value="">Pilih Mata Kuliah...</option>
                {coursesData?.data.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.course_code} - {course.course_name}
                  </option>
                ))}
              </select>
              {errors.course_id && <p className="mt-2 text-sm text-red-600">{errors.course_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...register('semester_id')}
                disabled={isSubmitting}
              >
                <option value="">Pilih Semester...</option>
                {semestersData?.data.map((semester: any) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
              {errors.semester_id && <p className="mt-2 text-sm text-red-600">{errors.semester_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori Ujian</label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...register('exam_category')}
                disabled={isSubmitting}
              >
                <option value="">Pilih Kategori...</option>
                <option value="UTS">Ujian Tengah Semester (UTS)</option>
                <option value="UAS">Ujian Akhir Semester (UAS)</option>
                <option value="KUIS">Kuis</option>
              </select>
              {errors.exam_category && <p className="mt-2 text-sm text-red-600">{errors.exam_category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dokumen Soal</label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" type="file" className="sr-only" {...register('file')} disabled={isSubmitting} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file.message?.toString()}</p>}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/koordinator/soals')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Mengunggah...' : 'Unggah Soal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
