import { useQuery } from '@tanstack/react-query';
import { MasterDataService } from '../services/masterData';

// Reusable Query Keys
export const queryKeys = {
  dosens: (page: number, perPage: number, withUser: boolean) => ['dosens', { page, perPage, withUser }] as const,
  dosen: (id: number) => ['dosen', id] as const,
  courses: (page: number, perPage: number, withClos: boolean) => ['courses', { page, perPage, withClos }] as const,
  course: (id: number) => ['course', id] as const,
  semesters: (page: number, perPage: number) => ['semesters', { page, perPage }] as const,
  plos: (page: number, perPage: number) => ['plos', { page, perPage }] as const,
  clos: (page: number, perPage: number, withPlos: boolean) => ['clos', { page, perPage, withPlos }] as const,
};

export const useDosens = (page = 1, perPage = 15, withUser = false) => {
  return useQuery({
    queryKey: queryKeys.dosens(page, perPage, withUser),
    queryFn: () => MasterDataService.getDosens(page, perPage, withUser),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDosen = (id: number) => {
  return useQuery({
    queryKey: queryKeys.dosen(id),
    queryFn: () => MasterDataService.getDosen(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourses = (page = 1, perPage = 15, withClos = false) => {
  return useQuery({
    queryKey: queryKeys.courses(page, perPage, withClos),
    queryFn: () => MasterDataService.getCourses(page, perPage, withClos),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourse = (id: number) => {
  return useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => MasterDataService.getCourse(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSemesters = (page = 1, perPage = 15) => {
  return useQuery({
    queryKey: queryKeys.semesters(page, perPage),
    queryFn: () => MasterDataService.getSemesters(page, perPage),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlos = (page = 1, perPage = 15) => {
  return useQuery({
    queryKey: queryKeys.plos(page, perPage),
    queryFn: () => MasterDataService.getPlos(page, perPage),
    staleTime: 5 * 60 * 1000,
  });
};

export const useClos = (page = 1, perPage = 15, withPlos = false) => {
  return useQuery({
    queryKey: queryKeys.clos(page, perPage, withPlos),
    queryFn: () => MasterDataService.getClos(page, perPage, withPlos),
    staleTime: 5 * 60 * 1000,
  });
};
