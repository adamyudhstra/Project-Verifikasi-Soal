import { useState } from 'react';
import { useCourses } from '../../hooks/useMasterData';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Link } from 'react-router';

export const Courses = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useCourses(page, 15, false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Master Courses</h2>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState title="No Courses Found" />
      ) : (
        <>
          <Table columns={['Code', 'Name', 'Credits', 'Semester', 'Category', 'Actions']}>
            {data.data.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium text-gray-900">{course.course_code}</TableCell>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>
                  <Link 
                    to={`/master/courses/${course.id}`}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </Table>
          <Pagination meta={data.meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};
