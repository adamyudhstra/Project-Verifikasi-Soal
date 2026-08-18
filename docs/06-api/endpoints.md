# API Endpoints

## 1. Authentication
### `GET /api/user` (Implemented)
- **Fungsi**: Memuat rincian profile user yang sedang login.
- **Middleware**: `auth:sanctum`

## 2. Assignment Management (Super Admin)
### `GET /api/koordinator-assignments` (Implemented)
- **Fungsi**: Mendapatkan daftar seluruh penugasan Koordinator beserta relasi MK dan Semesternya.

### `POST /api/koordinator-assignments` (Implemented)
- **Fungsi**: Membuat penugasan baru untuk seorang Koordinator pada MK dan Semester tertentu.
- **Payload Constraint**: Menolak jika kombinasi `course_id` + `semester_id` sudah memiliki Koordinator.

### `PUT /api/koordinator-assignments/{id}` (Implemented)
- **Fungsi**: Mengganti Koordinator untuk *assignment ID* spesifik (menimpa ID user tanpa menghapus baris histori utama atau soal).

### `POST /api/penugasan-verifikator` (Implemented)
- **Fungsi**: Menugaskan dosen Verifikator untuk mengawasi suatu Mata Kuliah.

## 3. Question (Soal) Management
### `GET /api/soal` (Implemented)
- **Fungsi**: Mengambil daftar soal. Di-*filter* secara implisit: Koordinator hanya melihat soal yang diunggahnya, Verifikator hanya melihat soal dari MK yang diawasinya.

### `GET /api/soal/template` (Implemented)
- **Fungsi**: Mengunduh berkas template standar soal.
- **Actor**: Koordinator.

### `POST /api/soal` (Implemented)
- **Fungsi**: Mengunggah file PDF soal baru.
- **Status**: Disimpan sebagai `SUBMITTED`, `version = 1`.

### `POST /api/soal/{id}/revisi` (Implemented)
- **Fungsi**: Mengunggah perbaikan dari soal yang berstatus `REVISION`.
- **Status**: Disimpan dengan `version++`, merestart status peninjauan.

## 4. Verifikasi
### `POST /api/soal/{id}/verifikasi` (Implemented)
- **Fungsi**: Merekam hasil peninjauan Verifikator.
- **Payload**: `{"status": "APPROVED|REVISION|REJECTED", "catatan": "..."}`
- **Constraint**: `catatan` wajib diisi apabila status bukan `APPROVED`.

## 5. Laporan & Export
### `GET /api/berita-acara/export` (Planned)
- **Fungsi**: Menghasilkan dokumen PDF Berita Acara untuk suatu *course_id* pada *semester_id* aktif.
- **Status**: Masih memerlukan implementasi PDF Generator dan arsitektur *Job Queue*. Tidak diizinkan menggunakan pola `dev_mode` bypass.
