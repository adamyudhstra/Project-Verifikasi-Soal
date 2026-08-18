import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { soalsService } from '../services/soals';

export const useSoals = (page = 1, perPage = 15, status?: string) => {
  return useQuery({
    queryKey: ['soals', { page, perPage, status }],
    queryFn: () => soalsService.getSoals(page, perPage, status),
  });
};

export const useSoalDetail = (id: number) => {
  return useQuery({
    queryKey: ['soal', id],
    queryFn: () => soalsService.getSoal(id),
    enabled: !!id,
  });
};

export const useUploadSoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => soalsService.uploadSoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soals'] });
    },
  });
};

export const useVerifySoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: string; notes?: string } }) =>
      soalsService.verifySoal(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['soals'] });
      queryClient.invalidateQueries({ queryKey: ['soal', variables.id] });
    },
  });
};

export const useBeritaAcara = (semesterId?: number) => {
  return useQuery({
    queryKey: ['berita-acara', semesterId],
    queryFn: () => soalsService.getBeritaAcara(semesterId!),
    enabled: !!semesterId,
  });
};
