import { useParams, useNavigate } from 'react-router';
import { useSoalDetail } from '../../hooks/useSoals';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ArrowLeft, Download, FileText, CheckCircle, XCircle, AlertCircle, Upload } from 'lucide-react';
import { apiClient } from '../../lib/axios';

export const SoalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useSoalDetail(Number(id));

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data?.data) return <div>Soal tidak ditemukan.</div>;

  const soal = data.data;

  const handleDownload = async () => {
    try {
      const response = await apiClient.get(`/soals/${soal.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Soal_${soal.course?.course_code}_${soal.exam_category}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to download', error);
      alert('Gagal mengunduh file.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'REVISION':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detail Soal</h2>
          <p className="mt-1 text-sm text-gray-500">
            {soal.course?.course_code} - {soal.course?.course_name}
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Informasi Dokumen</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Versi saat ini: v{soal.version}</p>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="mr-2 h-4 w-4" /> Unduh Dokumen
          </button>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Kategori Ujian</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{soal.exam_category}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Semester</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{soal.semester?.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status Saat Ini</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                {getStatusIcon(soal.status)}
                <span className="font-semibold">{soal.status}</span>
              </dd>
            </div>
            {soal.catatan && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-yellow-50">
                <dt className="text-sm font-medium text-yellow-800">Catatan Terakhir</dt>
                <dd className="mt-1 text-sm text-yellow-900 sm:mt-0 sm:col-span-2">
                  {soal.catatan}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg mt-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Riwayat Verifikasi</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              <li>
                <div className="relative pb-8">
                  {soal.verifikasis && soal.verifikasis.length > 0 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <Upload className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Diunggah oleh <span className="font-medium text-gray-900">{soal.uploader?.name}</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {new Date(soal.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {soal.verifikasis && soal.verifikasis.map((verifikasi: any, index: number) => (
                <li key={verifikasi.id}>
                  <div className="relative pb-8">
                    {index !== soal.verifikasis!.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          verifikasi.action === 'APPROVED' ? 'bg-green-500' :
                          verifikasi.action === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          {getStatusIcon(verifikasi.action)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5">
                        <div className="flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{verifikasi.action}</span> oleh <span className="font-medium text-gray-900">{verifikasi.verifikator?.name}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(verifikasi.created_at).toLocaleString()}
                          </div>
                        </div>
                        {verifikasi.catatan && (
                          <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                            <p>{verifikasi.catatan}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {soal.status === 'REVISION' && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/koordinator/soals/upload')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            <Upload className="mr-2 h-5 w-5" />
            Unggah Revisi
          </button>
        </div>
      )}
    </div>
  );
};
