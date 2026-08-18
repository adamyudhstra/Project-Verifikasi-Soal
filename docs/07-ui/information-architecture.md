# Information Architecture (Sitemap)

Susunan menu navigasi pada antarmuka pengguna, dipetakan secara eksklusif berdasarkan peran (Role) yang terautentikasi. Opsi navigasi ini diturunkan langsung dari alur kerja (workflows), bukan berdasarkan desain tiruan (mockup) lawas.

## 1. Super Admin Menu
**Fokus**: Konfigurasi global dan Master Data.

- **Dashboard** (Monitoring semester berjalan)
- **Master Data**
  - Import Kurikulum (Wizard 4 langkah: MK, Kategori, PLO, CLO)
  - Daftar Mata Kuliah (Read-only view dari hasil import)
  - Daftar PLO & CLO (Read-only view)
  - Daftar Dosen (CRUD manual)
- **Penugasan (Assignments)**
  - Penugasan Koordinator MK
  - Penugasan Dosen Verifikator
- **Pengaturan**
  - Tahun Ajaran & Semester
  - Kategori Soal

## 2. Koordinator Menu
**Fokus**: Kepatuhan unggah soal dan respons terhadap revisi.

- **Dashboard** (Khusus menampilkan ringkasan MK yang ditugaskan kepadanya)
- **Manajemen Soal**
  - Unduh Template
  - Unggah Soal
  - Status Verifikasi (Riwayat & Aksi untuk Revisi)

## 3. Verifikator Menu
**Fokus**: Kualitas penjaminan mutu instrumen akademik (Quality Assurance).

- **Dashboard** (Khusus tugas verifikasinya)
- **Peninjauan Soal**
  - Antrean Verifikasi (Daftar soal berstatus SUBMITTED dari MK yang diawasi)
  - Cetak Berita Acara (Rekapitulasi akhir periode)

> [!WARNING]
> Segala *interface* terkait "Penetapan Nilai PLO" telah dieliminasi dari arsitektur informasi.
