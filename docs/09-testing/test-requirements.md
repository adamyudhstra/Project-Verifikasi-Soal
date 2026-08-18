# Test Requirements

Berdasarkan arsitektur *backend* Laravel dan *frontend* React, spesifikasi pengujian minimum yang harus disediakan adalah sebagai berikut:

## 1. Unit Testing (Backend)
- **Model / Database Constraints**:
  - Menguji `koordinator_assignments` akan menolak insert apabila kombinasi `course_id` dan `semester_id` yang sama dicoba dimasukkan ulang tanpa menonaktifkan yang lama (Unique constraint).
- **Service Layer**:
  - Memastikan *parsing* excel pada `CurriculumImportService` merespons *rollback* dengan benar ketika ada satu sheet/baris yang error (sifat transaksional).

## 2. Feature / Integration Testing (Backend)
Test *HTTP Endpoint* secara *End-to-End* pada aplikasi (via `Illuminate\Foundation\Testing\RefreshDatabase`):
- **Otorisasi API**:
  - Menguji endpoint `POST /api/soal` dengan user ber-role *Verifikator* harus mendapat *Forbidden* (403).
  - Menguji `PUT /api/koordinator-assignments` dengan kredensial non-SuperAdmin.
- **Workflow Testing**:
  - Simulasi skenario penuh: *Upload Soal* (Koordinator) -> API mengembalikan `201 Created` -> *Tinjau & Revisi* (Verifikator) -> API mengembalikan status sukses verifikasi -> *Re-Upload Soal* (Koordinator) -> Versi di-increment.
  - Simulasi penggantian dosen Koordinator MK dan membuktikan dosen yang baru memiliki akses `GET` terhadap dokumen dosen yang lama.

## 3. UI Component Testing (Frontend - React)
- **Komponen Form Import**: Menguji validasi format *file extension* sebelum dikirim ke server.
- **State Semester**: Menguji bahwa mengubah *Context* semester di header *topbar* akan mengubah nilai prop API pemanggilan data metrik dashboard.
- **Conditional Rendering**: Elemen navigasi "Import Kurikulum" dipastikan tidak muncul (tidak dirender di DOM) apabila state *role user* bukanlah `SUPER_ADMIN`.
