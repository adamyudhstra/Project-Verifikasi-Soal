import { apiClient } from '../lib/axios';
import type { PaginatedResponse } from '../types';

export interface Soal {
  id: number;
  course_id: number;
  semester_id: number;
  uploader_id: number;
  exam_category: string;
  file_path: string;
  version: number;
  status: 'SUBMITTED' | 'REVISION' | 'APPROVED' | 'REJECTED';
  catatan?: string | null;
  created_at: string;
  updated_at: string;
  course?: any;
  semester?: any;
  uploader?: any;
  verifikasis?: any[];
}

export const soalsService = {
  getSoals: async (page = 1, perPage = 15, status?: string): Promise<PaginatedResponse<Soal>> => {
    const params: any = { page, per_page: perPage };
    if (status) params.status = status;
    const response = await apiClient.get('/soals', { params });
    return response.data;
  },

  getSoal: async (id: number): Promise<{ data: Soal }> => {
    const response = await apiClient.get(`/soals/${id}`);
    return response.data;
  },

  uploadSoal: async (data: FormData): Promise<{ data: Soal }> => {
    const response = await apiClient.post('/soals', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  verifySoal: async (id: number, data: { status: string; notes?: string }): Promise<{ data: Soal }> => {
    const response = await apiClient.post(`/soals/${id}/verify`, data);
    return response.data;
  },

  getBeritaAcara: async (semesterId: number): Promise<{ data: any }> => {
    const response = await apiClient.get('/reports/berita-acara', {
      params: { semester_id: semesterId },
    });
    return response.data;
  },
};
