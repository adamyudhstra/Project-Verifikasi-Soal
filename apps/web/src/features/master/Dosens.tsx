import { useState } from 'react';
import { useDosens } from '../../hooks/useMasterData';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export const Dosens = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useDosens(page, 15, true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Master Dosens</h2>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState title="No Dosens Found" />
      ) : (
        <>
          <Table columns={['Kode Dosen', 'Nama', 'JFA', 'No. HP', 'Linked Account']}>
            {data.data.map((dosen) => (
              <TableRow key={dosen.id}>
                <TableCell className="font-medium text-gray-900">{dosen.kode_dosen || '-'}</TableCell>
                <TableCell>{dosen.nama}</TableCell>
                <TableCell>{dosen.jfa || '-'}</TableCell>
                <TableCell>{dosen.no_hp || '-'}</TableCell>
                <TableCell>
                  {dosen.user ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Yes ({dosen.user.email})
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      No
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
