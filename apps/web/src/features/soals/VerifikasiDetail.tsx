import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSoalDetail, useVerifySoal } from '../../hooks/useSoals';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ArrowLeft, Download, CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';
import { apiClient } from '../../lib/axios';

const schema = z.object({
  status: z.enum(['APPROVED', 'REVISION', 'REJECTED'], {
    required_error: 'Keputusan verifikasi wajib dipilih',
  }),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if ((data.status === 'REVISION' || data.status === 'REJECTED') && (!data.notes || data.notes.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Catatan wajib diisi jika status Revisi atau Ditolak',
      path: ['notes'],
    });
  }
});

type FormValues = z.infer<typeof schema>;

export const VerifikasiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { data, isLoading, isError, refetch } = useSoalDetail(Number(id));
  const verifyMutation = useVerifySoal();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const selectedStatus = watch('status');

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

  const onSubmit = async (formData: FormValues) => {
    setServerError(null);
    try {
      await verifyMutation.mutateAsync({
        id: soal.id,
        data: formData,
      });
      reset();
      navigate('/verifikator/antrean');
    } catch (error: any) {
      if (error.response?.status === 403) {
        setServerError('Anda tidak memiliki izin untuk memverifikasi dokumen ini.');
      } else if (error.response?.status === 422) {
        setServerError(error.response.data.message || 'Validasi gagal.');
      } else {
        setServerError('Terjadi kesalahan saat menyimpan verifikasi.');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/verifikator/antrean')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Peninjauan Soal</h2>
          <p className="mt-1 text-sm text-gray-500">
            {soal.course?.course_code} - {soal.course?.course_name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Document Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Informasi Dokumen</h3>
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
                  <dt className="text-sm font-medium text-gray-500">Diunggah Oleh</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
                    {soal.uploader?.name}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Kategori Ujian</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{soal.exam_category}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Versi Dokumen</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">v{soal.version}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Tanggal Unggah</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(soal.created_at).toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Right Column: Decision Panel */}
        <div className="space-y-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Panel Keputusan</h3>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              {serverError && (
                <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="text-base font-medium text-gray-900">Keputusan Verifikasi</label>
                  <p className="text-sm leading-5 text-gray-500 mb-4">Pilih salah satu status di bawah ini untuk menindaklanjuti dokumen.</p>
                  
                  <div className="space-y-4">
                    <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none border-gray-300 hover:border-green-500">
                      <input type="radio" value="APPROVED" className="sr-only" {...register('status')} disabled={isSubmitting} />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900 flex items-center gap-2">
                            <CheckCircle className={`h-5 w-5 ${selectedStatus === 'APPROVED' ? 'text-green-600' : 'text-gray-400'}`} />
                            Setujui (Approved)
                          </span>
                        </span>
                      </span>
                      <CheckCircle className={`h-5 w-5 ${selectedStatus === 'APPROVED' ? 'text-green-600' : 'hidden'}`} />
                      <span className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${selectedStatus === 'APPROVED' ? 'border-green-600' : 'border-transparent'}`} aria-hidden="true"></span>
                    </label>

                    <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none border-gray-300 hover:border-yellow-500">
                      <input type="radio" value="REVISION" className="sr-only" {...register('status')} disabled={isSubmitting} />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900 flex items-center gap-2">
                            <AlertCircle className={`h-5 w-5 ${selectedStatus === 'REVISION' ? 'text-yellow-600' : 'text-gray-400'}`} />
                            Revisi (Revision)
                          </span>
                        </span>
                      </span>
                      <CheckCircle className={`h-5 w-5 ${selectedStatus === 'REVISION' ? 'text-yellow-600' : 'hidden'}`} />
                      <span className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${selectedStatus === 'REVISION' ? 'border-yellow-600' : 'border-transparent'}`} aria-hidden="true"></span>
                    </label>

                    <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none border-gray-300 hover:border-red-500">
                      <input type="radio" value="REJECTED" className="sr-only" {...register('status')} disabled={isSubmitting} />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900 flex items-center gap-2">
                            <XCircle className={`h-5 w-5 ${selectedStatus === 'REJECTED' ? 'text-red-600' : 'text-gray-400'}`} />
                            Tolak (Rejected)
                          </span>
                        </span>
                      </span>
                      <CheckCircle className={`h-5 w-5 ${selectedStatus === 'REJECTED' ? 'text-red-600' : 'hidden'}`} />
                      <span className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${selectedStatus === 'REJECTED' ? 'border-red-600' : 'border-transparent'}`} aria-hidden="true"></span>
                    </label>
                  </div>
                  {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Catatan Verifikator {(selectedStatus === 'REVISION' || selectedStatus === 'REJECTED') && <span className="text-red-500">*</span>}
                  </label>
                  <div className="mt-1">
                    <textarea
                      rows={4}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                      placeholder="Masukkan catatan perbaikan jika diperlukan..."
                      {...register('notes')}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.notes && <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || soal.status === 'APPROVED'}
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Memproses...' : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Keputusan
                      </>
                    )}
                  </button>
                  {soal.status === 'APPROVED' && (
                    <p className="mt-2 text-sm text-gray-500 text-center">Dokumen ini sudah disetujui.</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
