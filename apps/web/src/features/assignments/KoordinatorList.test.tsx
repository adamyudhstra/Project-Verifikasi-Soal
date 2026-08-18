import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KoordinatorList } from './KoordinatorList';
import { useAuthStore } from '../../lib/store';
import { apiClient } from '../../lib/axios';

vi.mock('../../lib/axios', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <KoordinatorList />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('KoordinatorList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('renders list and hides mutation controls for non-admin', async () => {
    useAuthStore.setState({ user: { id: 2, name: 'Dosen', email: 'dosen@test.com', role: 'DOSEN' } as any });
    
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url === '/koordinator-assignments') {
        return Promise.resolve({
          data: {
            data: [
              { id: 1, course: { course_code: 'IF101', course_name: 'Intro' }, semester: { name: 'Sem 1', is_active: true }, user: { name: 'Dr. John', email: 'john@test.com' }, created_at: '2023-01-01' }
            ],
            meta: { current_page: 1, last_page: 1, total: 1 }
          }
        });
      }
      if (url === '/semesters') return Promise.resolve({ data: { data: [] } });
      return Promise.resolve({ data: {} });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Koordinator Assignments')).toBeInTheDocument();
      expect(screen.getByText('IF101 - Intro')).toBeInTheDocument();
      expect(screen.queryByText('Add Assignment')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Delete Assignment')).not.toBeInTheDocument();
    });
  });

  it('shows mutation controls for SUPER_ADMIN', async () => {
    useAuthStore.setState({ user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'SUPER_ADMIN' } as any });
    
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url === '/koordinator-assignments') {
        return Promise.resolve({
          data: {
            data: [
              { id: 1, course: { course_code: 'IF101', course_name: 'Intro' }, semester: { name: 'Sem 1', is_active: true }, user: { name: 'Dr. John', email: 'john@test.com' }, created_at: '2023-01-01' }
            ],
            meta: { current_page: 1, last_page: 1, total: 1 }
          }
        });
      }
      if (url === '/semesters') return Promise.resolve({ data: { data: [] } });
      return Promise.resolve({ data: {} });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Add Assignment')).toBeInTheDocument();
      expect(screen.getByTitle('Delete Assignment')).toBeInTheDocument();
    });
  });

  it('handles delete action', async () => {
    useAuthStore.setState({ user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'SUPER_ADMIN' } as any });
    
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url === '/koordinator-assignments') {
        return Promise.resolve({
          data: {
            data: [{ id: 1, course: { course_code: 'IF101', course_name: 'Intro' }, semester: { name: 'Sem 1', is_active: true }, user: { name: 'Dr. John' }, created_at: '2023-01-01' }],
            meta: { current_page: 1, last_page: 1, total: 1 }
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    (apiClient.delete as any).mockResolvedValueOnce({});

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTitle('Delete Assignment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('Delete Assignment'));

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to delete this Koordinator assignment? This action cannot be undone.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/koordinator-assignments/1');
    });
  });

  it('handles 403 on delete', async () => {
    useAuthStore.setState({ user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'SUPER_ADMIN' } as any });
    
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url === '/koordinator-assignments') {
        return Promise.resolve({
          data: {
            data: [{ id: 1, course: { course_code: 'IF101', course_name: 'Intro' }, semester: { name: 'Sem 1', is_active: true }, user: { name: 'Dr. John' }, created_at: '2023-01-01' }],
            meta: { current_page: 1, last_page: 1, total: 1 }
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    (apiClient.delete as any).mockRejectedValueOnce({
      response: { status: 403 }
    });

    renderComponent();

    await waitFor(() => expect(screen.getByTitle('Delete Assignment')).toBeInTheDocument());
    fireEvent.click(screen.getByTitle('Delete Assignment'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.getByText('You do not have permission to delete this assignment.')).toBeInTheDocument();
    });
  });
});
