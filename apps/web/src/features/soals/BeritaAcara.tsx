import { useState } from 'react';
import { useSemesters } from '../../hooks/useMasterData';
import { useBeritaAcara } from '../../hooks/useSoals';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Printer, CheckCircle, AlertCircle, XCircle, FileText } from 'lucide-react';

export const BeritaAcara = () => {
  const [semesterId, setSemesterId] = useState<number | undefined>();
  const { data: semestersData } = useSemesters(1, 100);
  
  const { data, isLoading, isError, refetch } = useBeritaAcara(semesterId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Berita Acara Verifikasi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Cetak rekapitulasi peninjauan soal berdasarkan semester.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={semesterId || ''}
            onChange={(e) => setSemesterId(Number(e.target.value))}
          >
            <option value="">Pilih Semester...</option>
            {semestersData?.data.map((semester: any) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
          <button
            onClick={handlePrint}
            disabled={!data?.data || isLoading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Printer className="mr-2 h-4 w-4" />
            Cetak Berita Acara
          </button>
        </div>
      </div>

      {!semesterId ? (
        <div className="bg-white shadow sm:rounded-lg px-4 py-12 text-center text-gray-500 print:hidden">
          Pilih semester untuk menampilkan Berita Acara.
        </div>
      ) : isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data?.data ? (
        <EmptyState title="Tidak ada data" message="Gagal memuat rekapitulasi berita acara." />
      ) : (
        <div className="bg-white shadow sm:rounded-lg p-8 print:shadow-none print:p-0" id="printable-area">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold uppercase underline">Berita Acara Verifikasi Soal Ujian</h1>
            <p className="mt-2 text-lg">
              Semester: {semestersData?.data.find((s: any) => s.id === semesterId)?.name}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 print:grid-cols-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <FileText className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">{data.data.total}</div>
              <div className="text-sm text-gray-500">Total Diunggah</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">{data.data.approved}</div>
              <div className="text-sm text-gray-500">Disetujui</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
              <AlertCircle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">{data.data.revision}</div>
              <div className="text-sm text-gray-500">Revisi</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <XCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">{data.data.rejected}</div>
              <div className="text-sm text-gray-500">Ditolak</div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Rincian Dokumen Soal</h3>
            <table className="min-w-full divide-y divide-gray-300 border">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 border-b">No</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b">Mata Kuliah</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b">Kategori</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b">Koordinator</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b">Status Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.data.details.map((soal: any, idx: number) => (
                  <tr key={soal.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{idx + 1}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {soal.course?.course_code} - {soal.course?.course_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{soal.exam_category}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{soal.uploader?.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold">
                      <span className={
                        soal.status === 'APPROVED' ? 'text-green-600' :
                        soal.status === 'REJECTED' ? 'text-red-600' :
                        soal.status === 'REVISION' ? 'text-yellow-600' : 'text-blue-600'
                      }>{soal.status}</span>
                    </td>
                  </tr>
                ))}
                {data.data.details.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">Tidak ada data untuk semester ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-16 flex justify-between">
            <div className="text-center">
              <p className="mb-16">Pimpinan / Kaprodi</p>
              <p className="font-bold underline">(......................................)</p>
            </div>
            <div className="text-center">
              <p className="mb-16">Ketua Tim Verifikator</p>
              <p className="font-bold underline">(......................................)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
