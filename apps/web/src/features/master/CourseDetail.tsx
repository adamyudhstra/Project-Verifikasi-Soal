import { useParams, Link } from 'react-router';
import { useCourse } from '../../hooks/useMasterData';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ArrowLeft } from 'lucide-react';

export const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || '0', 10);
  const { data: response, isLoading, isError, refetch } = useCourse(courseId);

  if (isLoading) return <LoadingState />;
  if (isError || !response) return <ErrorState onRetry={() => refetch()} message="Failed to load course details." />;

  const course = response.data;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link to="/master/courses" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Courses
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">{course.course_code} - {course.course_name}</h2>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Course Information</h3>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {course.category}
          </span>
        </div>
        <div className="px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Credits (SKS)</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{course.credits}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Suggested Semester</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{course.semester}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Course Learning Outcomes (CLOs)</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Skills and knowledge acquired in this course.</p>
        </div>
        
        {course.clos && course.clos.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {course.clos.map((clo) => (
              <li key={clo.id} className="p-4 sm:px-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-blue-600 truncate">{clo.code}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {clo.bloom_taxonomy}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex text-sm text-gray-700">
                    <p>{clo.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm">
            No CLOs mapped to this course yet.
          </div>
        )}
      </div>
    </div>
  );
};
