import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSoals } from '../../hooks/useSoals';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileText, Eye, Upload } from 'lucide-react';

export const SoalList = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useSoals(page, 15);

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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Soal</h2>
          <p className="mt-1 text-sm text-gray-500">
            Daftar soal yang Anda unggah sebagai Koordinator Mata Kuliah.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => window.open('/api/v1/soals/template', '_blank')}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FileText className="mr-2 h-4 w-4" />
            Unduh Template
          </button>
          <button
            onClick={() => navigate('/koordinator/soals/upload')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Unggah Soal
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState 
          title="Belum ada soal" 
          message="Anda belum mengunggah soal apapun. Silakan unggah soal untuk mata kuliah yang Anda ampu." 
        />
      ) : (
        <>
          <Table columns={['Mata Kuliah', 'Semester', 'Kategori', 'Versi', 'Status', 'Tanggal Unggah', 'Aksi']}>
            {data.data.map((soal: any) => (
              <TableRow key={soal.id}>
                <TableCell className="font-medium text-gray-900">
                  {soal.course?.course_code} - {soal.course?.course_name}
                </TableCell>
                <TableCell>{soal.semester?.name}</TableCell>
                <TableCell>{soal.exam_category}</TableCell>
                <TableCell>v{soal.version}</TableCell>
                <TableCell>{getStatusBadge(soal.status)}</TableCell>
                <TableCell>{new Date(soal.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <button
                    onClick={() => navigate(`/koordinator/soals/${soal.id}`)}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    title="Lihat Detail & Riwayat"
                  >
                    <Eye className="h-4 w-4 mr-1" /> Detail
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
