import { apiClient } from '../lib/axios';
import type { PaginatedResponse, KoordinatorAssignment, PenugasanVerifikator } from '../types';

export const AssignmentsService = {
  getKoordinatorAssignments: async (page = 1, perPage = 15, semesterId?: number) => {
    const response = await apiClient.get<PaginatedResponse<KoordinatorAssignment>>('/koordinator-assignments', {
      params: { page, per_page: perPage, semester_id: semesterId },
    });
    return response.data;
  },

  createKoordinatorAssignment: async (data: { course_id: number; semester_id: number; user_id: number }) => {
    const response = await apiClient.post<{ data: KoordinatorAssignment }>('/koordinator-assignments', data);
    return response.data.data;
  },

  deleteKoordinatorAssignment: async (id: number) => {
    await apiClient.delete(`/koordinator-assignments/${id}`);
  },

  getVerifikatorAssignments: async (page = 1, perPage = 15, semesterId?: number) => {
    const response = await apiClient.get<PaginatedResponse<PenugasanVerifikator>>('/penugasan-verifikators', {
      params: { page, per_page: perPage, semester_id: semesterId },
    });
    return response.data;
  },

  createVerifikatorAssignment: async (data: { semester_id: number; user_id: number }) => {
    const response = await apiClient.post<{ data: PenugasanVerifikator }>('/penugasan-verifikators', data);
    return response.data.data;
  },

  deleteVerifikatorAssignment: async (id: number) => {
    await apiClient.delete(`/penugasan-verifikators/${id}`);
  },
};
