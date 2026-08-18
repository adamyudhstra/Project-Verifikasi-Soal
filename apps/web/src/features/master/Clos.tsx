import { useState } from 'react';
import { useClos } from '../../hooks/useMasterData';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export const Clos = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useClos(page, 15, true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Master CLOs</h2>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState title="No CLOs Found" />
      ) : (
        <>
          <Table columns={['Code', 'Bloom Taxonomy', 'Description', 'Linked PLOs']}>
            {data.data.map((clo) => (
              <TableRow key={clo.id}>
                <TableCell className="font-medium text-gray-900 whitespace-nowrap">{clo.code}</TableCell>
                <TableCell>{clo.bloom_taxonomy}</TableCell>
                <TableCell className="whitespace-normal min-w-64">{clo.description}</TableCell>
                <TableCell className="whitespace-normal">
                  <div className="flex flex-wrap gap-1">
                    {clo.plos && clo.plos.length > 0 ? (
                      clo.plos.map((plo) => (
                        <span key={plo.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10" title={plo.description}>
                          {plo.code}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs">None</span>
                    )}
                  </div>
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
