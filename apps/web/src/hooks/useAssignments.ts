import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AssignmentsService } from '../services/assignments';

export const assignmentQueryKeys = {
  koordinatorAssignments: (page: number, perPage: number, semesterId?: number) => ['koordinator-assignments', { page, perPage, semesterId }] as const,
  verifikatorAssignments: (page: number, perPage: number, semesterId?: number) => ['penugasan-verifikators', { page, perPage, semesterId }] as const,
};

export const useKoordinatorAssignments = (page = 1, perPage = 15, semesterId?: number) => {
  return useQuery({
    queryKey: assignmentQueryKeys.koordinatorAssignments(page, perPage, semesterId),
    queryFn: () => AssignmentsService.getKoordinatorAssignments(page, perPage, semesterId),
    staleTime: 0, // Always fetch latest for assignments
  });
};

export const useCreateKoordinatorAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AssignmentsService.createKoordinatorAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['koordinator-assignments'] });
    },
  });
};

export const useDeleteKoordinatorAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AssignmentsService.deleteKoordinatorAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['koordinator-assignments'] });
    },
  });
};

export const useVerifikatorAssignments = (page = 1, perPage = 15, semesterId?: number) => {
  return useQuery({
    queryKey: assignmentQueryKeys.verifikatorAssignments(page, perPage, semesterId),
    queryFn: () => AssignmentsService.getVerifikatorAssignments(page, perPage, semesterId),
    staleTime: 0,
  });
};

export const useCreateVerifikatorAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AssignmentsService.createVerifikatorAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penugasan-verifikators'] });
    },
  });
};

export const useDeleteVerifikatorAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AssignmentsService.deleteVerifikatorAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penugasan-verifikators'] });
    },
  });
};
