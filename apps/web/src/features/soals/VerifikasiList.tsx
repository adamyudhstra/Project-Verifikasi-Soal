import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSoals } from '../../hooks/useSoals';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Eye } from 'lucide-react';

export const VerifikasiList = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useSoals(page, 15, statusFilter || undefined);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Approved</span>;
      case 'REVISION':
        return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Revision</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Rejected</span>;
      default:
        return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Submitted</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Antrean Verifikasi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Daftar soal yang harus Anda tinjau sebagai Verifikator.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="SUBMITTED">Menunggu Peninjauan (Submitted)</option>
            <option value="APPROVED">Disetujui (Approved)</option>
            <option value="REVISION">Revisi (Revision)</option>
            <option value="REJECTED">Ditolak (Rejected)</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState 
          title="Tidak ada soal" 
          message="Tidak ada dokumen soal yang sesuai dengan kriteria filter saat ini." 
        />
      ) : (
        <>
          <Table columns={['Mata Kuliah', 'Semester', 'Kategori', 'Koordinator', 'Versi', 'Status', 'Tanggal Unggah', 'Aksi']}>
            {data.data.map((soal: any) => (
              <TableRow key={soal.id}>
                <TableCell className="font-medium text-gray-900">
                  {soal.course?.course_code} - {soal.course?.course_name}
                </TableCell>
                <TableCell>{soal.semester?.name}</TableCell>
                <TableCell>{soal.exam_category}</TableCell>
                <TableCell>
                  {soal.uploader?.name}
                </TableCell>
                <TableCell>v{soal.version}</TableCell>
                <TableCell>{getStatusBadge(soal.status)}</TableCell>
                <TableCell>{new Date(soal.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <button
                    onClick={() => navigate(`/verifikator/antrean/${soal.id}`)}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    title="Tinjau Soal"
                  >
                    <Eye className="h-4 w-4 mr-1" /> Tinjau
                  </button>
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
