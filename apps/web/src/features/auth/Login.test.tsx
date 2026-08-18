import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Login } from './Login';
import { useAuthStore } from '../../lib/store';
import { apiClient } from '../../lib/axios';

// Mock the axios client
vi.mock('../../lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

// Provide a custom render for routing context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ isHydrating: false, isAuthenticated: false, token: null, user: null });
  });

  it('renders login form', () => {
    renderWithRouter(<Login />);
    expect(screen.getByText('Verifikasi Soal')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithRouter(<Login />);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Alamat email tidak valid.')).toBeInTheDocument();
      expect(screen.getByText('Password wajib diisi.')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const mockUser = { id: 1, name: 'Admin', email: 'admin@test.com', role: 'SUPER_ADMIN' };
    const mockToken = 'fake-token';
    
    (apiClient.post as any).mockResolvedValueOnce({
      data: {
        data: {
          user: mockUser,
          token: mockToken,
        }
      }
    });

    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/login', {
        email: 'admin@test.com',
        password: 'password123',
      });
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });
  });

  it('handles authentication failure', async () => {
    (apiClient.post as any).mockRejectedValueOnce({
      response: {
        status: 401,
      }
    });

    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Gagal melakukan autentikasi. Silakan periksa kredensial Anda dan coba lagi.')).toBeInTheDocument();
    });
  });

  it('handles 422 validation errors from backend', async () => {
    (apiClient.post as any).mockRejectedValueOnce({
      response: {
        status: 422,
        data: {
          errors: {
            email: ['Email tidak terdaftar.'],
          }
        }
      }
    });

    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Email tidak terdaftar.')).toBeInTheDocument();
    });
  });
});
