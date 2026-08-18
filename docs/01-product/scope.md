# Scope Document

## 1. In Scope
Sistem Verifikasi Soal secara resmi mencakup fungsi-fungsi berikut:

### Autentikasi dan Otorisasi
- Autentikasi pengguna dan perlindungan halaman.
- Otorisasi berdasarkan role (Super Admin, Koordinator, Verifikator).
- Otorisasi berbasis hak kepemilikan/penugasan terhadap Mata Kuliah.

### Pengelolaan Master Data (via Import)
- Mengimpor data kurikulum (Mata Kuliah, PLO, CLO, dan pemetaannya) dari file Excel secara *bulk* sesuai dengan prinsip *Outcome-Based Education* (OBE).
- Manajemen siklus hidup data akademik tanpa harus membuat master data Kurikulum secara manual satu per satu dari nol.
- Pengelolaan master data Dosen dan Tahun Ajaran.
- Pengelolaan referensi Kategori Soal.

### Manajemen Penugasan
- Penetapan dan pergantian **Koordinator** untuk Mata Kuliah pada Semester Akademik berjalan dengan mempertahankan histori.
- Penetapan **Verifikator** untuk memvalidasi soal-soal.

### Alur Soal dan Verifikasi
- Pengunggahan dokumen soal (termasuk template awal dan revisi).
- Proses verifikasi soal (Approved, Revision, Rejected).
- Pencatatan catatan (notes) verifikasi pada setiap tahap.
- Riwayat revisi dan verifikasi.

### Laporan dan Monitoring
- Dashboard monitoring kemajuan status unggah dan verifikasi berdasarkan **semester berjalan dan periode aktif**.
- *Berita Acara* hasil verifikasi terkompilasi per Mata Kuliah dan Periode.
- Logging aktivitas sistem.

---

## 2. Out of Scope
Fitur dan kebutuhan berikut secara tegas tidak termasuk dalam batasan rilis sistem:

- **Penetapan Nilai PLO**: Secara tegas **DIHAPUS** dari seluruh antarmuka, API, database, workflows, maupun aturan bisnis. Sistem ini hanya memetakan hubungan antara CLO/PLO, bukan untuk perhitungan nilai (grading) capaian PLO mahasiswa.
- **Aplikasi Mobile Native**: Hanya akan didukung dalam format *web application responsive*, tidak akan ada aplikasi Android/iOS spesifik.
- **Pembuatan Soal Langsung di Browser**: Pengguna mengunggah dokumen jadi (misal: PDF/Word), sistem tidak memiliki teks editor untuk merakit soal dari bank soal.
- **Ujian Online Mahasiswa**: Ini bukan sistem *Computer-Based Test* (CBT).
- **Integrasi Langsung (API)**: Tidak ada integrasi sistem akademik kampus *real-time* pihak ketiga pada iterasi ini (sistem bergantung pada *Excel Import*).
