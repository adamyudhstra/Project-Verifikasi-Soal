# Authentication & Authorization

Sistem Verifikasi Soal ini menerapkan proteksi berganda berbasis *Role-Based Access Control* (RBAC) yang dikombinasikan dengan *Assignment-Based Access Control*. Otorisasi tidak boleh hanya mengandalkan frontend (UI hiding).

## 1. Authentication (Autentikasi)
Seluruh rute kecuali login diproteksi menggunakan **Laravel Sanctum**. 
- Pengguna yang belum login akan menerima response `401 Unauthorized`.
- *Session* dijaga melalui cookie (jika aplikasi diakses sebagai SPA dari domain yang sama) atau Token Bearer (jika diakses dari luar).

## 2. Authorization (Otorisasi Akses)
Sistem membagi kontrol otorisasi menjadi dua layer: **Layer Role** dan **Layer Penugasan (Ownership)**.

### a. Level Otorisasi Role (RBAC)
- **Super Admin**: Dapat mengakses endpoint `/api/koordinator-assignments`, `/api/penugasan-verifikator`, `/api/semesters`, `/api/soal-kategori`, dsb. Tidak dapat mengunggah soal.
- **Koordinator**: Hanya dapat mengakses endpoint terkait upload soal (`POST /api/soal`), pengunduhan template, dan revisi soal miliknya.
- **Verifikator**: Hanya dapat mengakses daftar antrean verifikasi (`GET /api/soal` yang di-*filter*) dan endpoint pemberian status verifikasi (`POST /api/soal/{id}/verifikasi`).

### b. Level Otorisasi Penugasan (Assignment/Ownership Control)
*Policy* yang lebih granular wajib diterapkan di backend (misal via Laravel Policies seperti `SoalPolicy`):
- **Koordinator**:
  - Walau memiliki role "Koordinator", pengguna ini **Hanya** diizinkan mengakses dan mengunggah soal untuk `course_id` (Mata Kuliah) yang terdaftar atas nama ID miliknya pada `koordinator_assignments` untuk *Semester Berjalan*.
  - **Skenario Historis**: Jika Koordinator A digantikan oleh Koordinator B di tengah semester, maka B **secara otomatis mewarisi hak akses baca dan tulis (revisi)** terhadap soal-soal milik MK tersebut yang pernah diunggah oleh A sebelumnya, selama masih dalam *Semester Akademik* dan *Periode* yang relevan dengan tugas B saat ini. A akan kehilangan akses ubah untuk MK tersebut jika status assignment-nya telah dimatikan (Ended).
- **Verifikator**:
  - Hanya dapat mengakses endpoint pratinjau, unduh, dan keputusan status untuk soal-soal di mana MK-nya berada di dalam mandat penugasan `penugasan_verifikator` dirinya.

## 3. Isolasi File
Endpoint unduh soal PDF (contoh: `/api/soal/{id}/download`) **TIDAK BOLEH** bersifat publik. File fisik tidak boleh disimpan di `public/storage`. Harus berada di internal `storage/app/soal` dan disalurkan secara *stream* melalui otorisasi *controller*.
