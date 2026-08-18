import { apiClient } from '../lib/axios';
import type { PaginatedResponse, SingleResponse, Dosen, Course, Semester, Plo, Clo } from '../types';

export const MasterDataService = {
  getDosens: async (page = 1, perPage = 15, withUser = false) => {
    const response = await apiClient.get<PaginatedResponse<Dosen>>('/dosens', {
      params: { page, per_page: perPage, with_user: withUser ? 1 : 0 },
    });
    return response.data;
  },
  getDosen: async (id: number) => {
    const response = await apiClient.get<SingleResponse<Dosen>>(`/dosens/${id}`);
    return response.data;
  },
  getCourses: async (page = 1, perPage = 15, withClos = false) => {
    const response = await apiClient.get<PaginatedResponse<Course>>('/courses', {
      params: { page, per_page: perPage, with_clos: withClos ? 1 : 0 },
    });
    return response.data;
  },
  getCourse: async (id: number) => {
    const response = await apiClient.get<SingleResponse<Course>>(`/courses/${id}`);
    return response.data;
  },
  getSemesters: async (page = 1, perPage = 15) => {
    const response = await apiClient.get<PaginatedResponse<Semester>>('/semesters', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },
  getPlos: async (page = 1, perPage = 15) => {
    const response = await apiClient.get<PaginatedResponse<Plo>>('/plos', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },
  getClos: async (page = 1, perPage = 15, withPlos = false) => {
    const response = await apiClient.get<PaginatedResponse<Clo>>('/clos', {
      params: { page, per_page: perPage, with_plos: withPlos ? 1 : 0 },
    });
    return response.data;
  },
};
