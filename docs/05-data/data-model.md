# Data Model

Dokumen ini memaparkan pemodelan konseptual tingkat tinggi dari struktur entitas Website Verifikator.

## 1. Domain Pengguna & Otorisasi
- **`users`**: Merepresentasikan identitas aktor (Dosen / Staff) di dalam sistem. Model ini menampung informasi standar autentikasi dan menyimpan **Role** secara eksplisit. Atribut *Role* ini tunggal per user (Super Admin, Koordinator, Verifikator).

## 2. Domain Waktu (Semester)
- **`semesters`**: Merepresentasikan **Tahun Ajaran & Semester Akademik** (misal: "Ganjil 2025/2026"). Memiliki penanda rentang waktu (`start_date`, `end_date`) dan flag `is_active` untuk menentukan fokus *default* sistem berjalan.

## 3. Domain Kurikulum (Master Akademik)
- **`courses` (Mata Kuliah)**: Membawa atribut statis MK (Kode, SKS, Kategori MK, Semester Kurikulum). Tidak mengikat ke *Semester Akademik*, melainkan berfungsi sebagai *Master Data*.
- **`plos`**: Entitas *Program Learning Outcome*.
- **`clos`**: Entitas *Course Learning Outcome*. 
- **Many-to-Many Mappings**: Tabel pivot `course_clo` dan `clo_plo` menjadi penaut relasi.

## 4. Domain Penugasan (Assignments)
- **`koordinator_assignments`**: Menghubungkan 3 sumbu: `courses`, `users` (Koordinator), dan `semesters`. Memiliki unique constraint `(course_id, semester_id)` (Satu MK hanya satu Koordinator per semester).
- **`penugasan_verifikator`**: Menghubungkan `courses` dan `users` (Verifikator). Bisa lebih dari satu Verifikator per MK jika dibutuhkan.

## 5. Domain Transaksional (Soal & Verifikasi)
- **`soal`**: Entitas sentral yang diunggah. Menautkan *file PDF*, versi, *uploader* (Koordinator), *course_id*, *kategori_ujian* (UTS/UAS), serta *status* (Draft/Submitted/Review/dll).
- **`verifikasi` (atau log verifikasi)**: Riwayat keputusan verifikator. Menyimpan `soal_id`, `verifikator_id`, aksi (Approved/Rev/Rej), serta `catatan` teks yang bersifat wajib bila ditolak/direvisi.
- **`revisi_soal` (Opsional/Bisa bersatu di tabel soal)**: Jika ERD fisik memisahkan, ini menjadi arsip versi. Jika menggunakan pola versi (increment int), `soal` menampung seluruh baris sejarah.
