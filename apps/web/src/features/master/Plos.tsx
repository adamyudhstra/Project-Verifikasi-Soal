import { useState } from 'react';
import { usePlos } from '../../hooks/useMasterData';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export const Plos = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = usePlos(page, 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Master PLOs</h2>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState title="No PLOs Found" />
      ) : (
        <>
          <Table columns={['Code', 'Description']}>
            {data.data.map((plo) => (
              <TableRow key={plo.id}>
                <TableCell className="font-medium text-gray-900 w-32">{plo.code}</TableCell>
                <TableCell className="whitespace-normal">{plo.description}</TableCell>
              </TableRow>
            ))}
          </Table>
          <Pagination meta={data.meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};
