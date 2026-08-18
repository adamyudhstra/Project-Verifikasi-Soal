import { useState } from 'react';
import { useVerifikatorAssignments, useDeleteVerifikatorAssignment } from '../../hooks/useAssignments';
import { useSemesters } from '../../hooks/useMasterData';
import { useAuthStore } from '../../lib/store';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { VerifikatorFormModal } from './VerifikatorFormModal';
import { Plus, Trash2 } from 'lucide-react';

export const VerifikatorList = () => {
  const [page, setPage] = useState(1);
  const [semesterFilter, setSemesterFilter] = useState<number | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useVerifikatorAssignments(page, 15, semesterFilter);
  const { data: semestersData } = useSemesters(1, 100);
  
  const deleteMutation = useDeleteVerifikatorAssignment();
  const currentUser = useAuthStore((state) => state.user);
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setDeleteError('You do not have permission to delete this assignment.');
      } else {
        setDeleteError('Failed to delete assignment.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Verifikator Assignments</h2>
        
        <div className="flex items-center gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={semesterFilter || ''}
            onChange={(e) => {
              setSemesterFilter(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
          >
            <option value="">All Semesters</option>
            {semestersData?.data.map((semester: any) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>

          {isSuperAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Assignment
            </button>
          )}
        </div>
      </div>

      {deleteError && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{deleteError}</p>
        </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState title="No Assignments Found" message="Try changing the semester filter or adding a new assignment." />
      ) : (
        <>
          <Table columns={['Semester', 'Verifikator', 'Status', 'Created At', ...(isSuperAdmin ? ['Actions'] : [])]}>
            {data.data.map((assignment: any) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium text-gray-900">{assignment.semester?.name}</TableCell>
                <TableCell>
                  {assignment.user?.name}
                  <br />
                  <span className="text-xs text-gray-500">{assignment.user?.email}</span>
                </TableCell>
                <TableCell>
                  {assignment.semester?.is_active ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      Past
                    </span>
                  )}
                </TableCell>
                <TableCell>{new Date(assignment.created_at).toLocaleDateString()}</TableCell>
                {isSuperAdmin && (
                  <TableCell>
                    <button
                      onClick={() => setDeleteId(assignment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Assignment"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </Table>
          <Pagination meta={data.meta} onPageChange={setPage} />
        </>
      )}

      <VerifikatorFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Assignment"
        message="Are you sure you want to delete this Verifikator assignment? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteId(null);
          setDeleteError(null);
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
