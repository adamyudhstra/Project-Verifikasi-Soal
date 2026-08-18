# Data Dictionary

Kamus data untuk entitas (tabel) kritikal dalam sistem (konsolidasi antara legacy, ERD, dan konvensi *naming* Laravel).

*(Catatan: Terminologi Indonesia dan Inggris pada level schema disatukan ke konvensi Inggris standard untuk tabel backend, sesuai framework Laravel).*

### 1. `users`
| Column | Type | Nullable | FK | Unique | Description |
|---|---|---|---|---|---|
| `id` | BigInt | No | - | PK | Primary Key |
| `name` | String | No | - | - | Nama lengkap pengguna |
| `email` | String | No | - | Yes | Alamat email (autentikasi) |
| `password` | String | No | - | - | Bcrypt hash |
| `role` | Enum | No | - | - | `SUPER_ADMIN`, `KOORDINATOR`, `VERIFIKATOR` |

### 2. `semesters`
| Column | Type | Nullable | FK | Unique | Description |
|---|---|---|---|---|---|
| `id` | BigInt | No | - | PK | Primary Key |
| `name` | String | No | - | - | Label. cth: "Ganjil 2025/2026" |
| `start_date` | Date | Yes | - | - | Awal semester |
| `end_date` | Date | Yes | - | - | Akhir semester |
| `is_active` | Boolean| No | - | - | Apakah ini semester berjalan? |

### 3. `courses` (Mata Kuliah)
| Column | Type | Nullable | FK | Unique | Description |
|---|---|---|---|---|---|
| `id` | BigInt | No | - | PK | Primary Key |
| `course_code` | String | No | - | Yes | Kode akademik |
| `course_name` | String | No | - | - | Nama MK (Indonesia) |
| `credits` | Integer| No | - | - | Jumlah SKS |
| `semester` | Integer| No | - | - | Semester kurikulum (1-8) |
| `category` | String | Yes | - | - | Pengelompokan (MKWP, MKWU, dll) |

### 4. `koordinator_assignments`
| Column | Type | Nullable | FK | Unique | Description |
|---|---|---|---|---|---|
| `id` | BigInt | No | - | PK | Primary Key |
| `course_id` | BigInt | No | `courses.id` | Yes* | *Unique constraint bersama `semester_id` |
| `semester_id` | BigInt | No | `semesters.id` | Yes* | *Unique constraint bersama `course_id` |
| `user_id` | BigInt | No | `users.id` | - | Dosen yang ditugaskan |
| `status` | String | No | - | - | `ACTIVE`, `ENDED` |

### 5. `soal`
| Column | Type | Nullable | FK | Unique | Description |
|---|---|---|---|---|---|
| `id` | BigInt | No | - | PK | Primary Key |
| `course_id` | BigInt | No | `courses.id` | - | MK terkait |
| `semester_id`| BigInt | No | `semesters.id`| - | Konteks semester soal |
| `uploader_id`| BigInt | No | `users.id` | - | Koordinator pengunggah |
| `file_path` | String | No | - | - | Lokasi fisik PDF soal |
| `version` | Integer| No | - | - | Angka revisi (1,2,...) |
| `status` | Enum | No | - | - | `SUBMITTED`,`APPROVED`,`REVISION`,`REJECTED` |
| `catatan` | Text | Yes | - | - | Notes dari Verifikator |
