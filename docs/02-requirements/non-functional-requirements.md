# Non-Functional Requirements

Dokumen ini menjelaskan persyaratan kualitas sistem (quality attributes) yang harus dipenuhi oleh Website Verifikator, yang tidak berkaitan langsung dengan fitur operasional.

## Security (Keamanan)
- **NFR-SEC-001 (Authentication)**: Seluruh endpoint API (kecuali login) harus diproteksi menggunakan Laravel Sanctum.
- **NFR-SEC-002 (Authorization)**: Setiap endpoint harus memiliki pengecekan hak akses di sisi *server-side* menggunakan Laravel Policies/Gates, tidak boleh hanya bergantung pada pembatasan elemen UI di *frontend*.
- **NFR-SEC-003 (File Access)**: Dokumen ujian (soal berformat PDF) bersifat sangat rahasia. File hanya boleh diakses melalui API terproteksi, dilarang menyimpan dokumen di direktori *public* web server.
- **NFR-SEC-004 (Ownership Isolation)**: Koordinator dilarang mengakses, melihat, atau memanipulasi entitas soal yang bukan menjadi tanggung jawabnya (Berdasarkan ID Assignment).

## Auditability & Logging
- **NFR-AUD-001 (Activity Log)**: Setiap aksi penting (Import kurikulum, pengubahan status soal, *assign* Koordinator, upload revisi) harus tercatat di dalam *Audit Log* (Timestamp, User ID, Action, Target, IP Address).
- **NFR-AUD-002 (Import Log)**: Kesalahan format ketika Super Admin melakukan *bulk import* harus ditangkap, dilog, dan disajikan dengan nomor baris yang spesifik kepada pengguna.

## File Handling (Penanganan File)
- **NFR-FILE-001 (MIME Validation)**: Dokumen yang diunggah harus divalidasi sebagai *Portable Document Format* (PDF).
- **NFR-FILE-002 (Idempotent Revision)**: Ketika revisi soal diunggah, file lama wajib dipertahankan dalam storage dengan penamaan (suffix) *versioning* yang jelas. Tidak ada *overwrite* berkas secara fisik.

## Performance & Availability
- **NFR-PERF-001 (Database Queries)**: Penyajian daftar soal dan master data harus mengatasi *N+1 query problem* dengan Eager Loading di Laravel, agar waktu muat tidak lambat ketika data bertambah besar.
- **NFR-PERF-002 (Rate Limiting)**: Endpoint API harus dilengkapi *throttling* (*rate limiting*) bawaan Laravel untuk mencegah *Brute Force* dan *DDoS* sederhana, terutama pada endpoint login dan upload.
- **NFR-AVAIL-001**: Sistem harus bisa beroperasi di lingkungan *concurrent* di *production*, karenanya disarankan kuat menggunakan PostgreSQL daripada SQLite.

## Maintainability
- **NFR-MAIN-001 (Code Quality)**: Dilarang menggunakan *Closure* untuk logika bisnis di `routes/api.php`. Seluruh logika wajib dipindahkan ke layer `Controller`, `Service`, atau `FormRequest`.
- **NFR-MAIN-002 (Data Seeding)**: Data *testing* dan *seeding* harus menggunakan data referensi akademik asli Prodi S1 Sistem Informasi (52 MK, 10 PLO, dsb.), bukan sepenuhnya data *dummy*, guna menjaga akurasi uji coba arsitektur aplikasi.
