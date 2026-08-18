import { useState } from 'react';
import { useSemesters } from '../../hooks/useMasterData';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export const Semesters = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useSemesters(page, 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Master Semesters</h2>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState title="No Semesters Found" />
      ) : (
        <>
          <Table columns={['Code', 'Name', 'Start Date', 'End Date', 'Status']}>
            {data.data.map((semester) => (
              <TableRow key={semester.id}>
                <TableCell className="font-medium text-gray-900">{semester.code}</TableCell>
                <TableCell>{semester.name}</TableCell>
                <TableCell>{semester.start_date || '-'}</TableCell>
                <TableCell>{semester.end_date || '-'}</TableCell>
                <TableCell>
                  {semester.is_active ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      Inactive
                    </span>
                  )}
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
