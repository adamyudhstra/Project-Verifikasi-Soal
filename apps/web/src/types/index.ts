export type Role = 'SUPER_ADMIN' | 'KOORDINATOR' | 'VERIFIKATOR';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Dosen {
  id: number;
  kode_dosen: string | null;
  nama: string;
  jfa: string | null;
  no_hp: string | null;
  user: User | null;
}

export interface Plo {
  id: number;
  code: string;
  description: string;
}

export interface Clo {
  id: number;
  code: string;
  description: string;
  bloom_taxonomy: string;
  plos?: Plo[];
}

export interface Course {
  id: number;
  course_code: string;
  course_name: string;
  credits: number;
  semester: number;
  category: string;
  clos?: Clo[];
}

export interface Semester {
  id: number;
  code: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export interface KoordinatorAssignment {
  id: number;
  course: Course;
  semester: Semester;
  user: { id: number; name: string; email: string };
  status: string;
  created_at: string;
}

export interface PenugasanVerifikator {
  id: number;
  semester: Semester;
  user: { id: number; name: string; email: string };
  status: string;
  created_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface ApiError {
  message: string;
}
