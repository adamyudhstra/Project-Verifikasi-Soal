# Glossary

Kamus data ini mendefinisikan seluruh istilah yang diakui dalam dokumentasi maupun kode *Website Verifikator*. Harap gunakan istilah ini secara konsisten. 

> [!WARNING]
> Terminologi usang seperti **"PIC"** dilarang digunakan untuk menunjuk penanggung jawab Mata Kuliah, gantikan dengan istilah **"Koordinator"**. Istilah **"Penetapan Nilai PLO"** dilarang dan dianggap *Out of Scope*.

## Peran (Roles)
- **Super Admin**: Akun sistem tertinggi yang dapat mengelola master data (Tahun Ajaran, Kategori Soal, Import Master Data Akademik) dan mengatur penugasan Koordinator serta Verifikator. Hanya ada satu peran Super Admin.
- **Koordinator (Dosen Koordinator MK)**: Dosen yang diberikan tanggung jawab oleh Super Admin untuk mengatur pengunggahan dan revisi soal untuk sebuah Mata Kuliah pada konteks Semester Akademik berjalan. Dapat digantikan secara periodik.
- **Verifikator (Dosen Verifikator)**: Dosen penjamin mutu yang ditugaskan oleh Super Admin untuk mengawasi dan memverifikasi soal yang telah dikirim oleh Koordinator pada MK tertentu.

## Istilah Akademik & Kurikulum (Sistem OBE)
- **OBE (Outcome-Based Education)**: Pendekatan pendidikan yang berfokus pada capaian pembelajaran. 
- **PLO (Program Learning Outcome)**: Capaian pembelajaran tingkat Program Studi. Didefinisikan dan dipetakan di level makro sistem akademik.
- **CLO (Course Learning Outcome)**: Capaian pembelajaran spesifik tingkat Mata Kuliah. Sebuah Mata Kuliah dapat memetakan ke beberapa CLO, dan satu CLO bisa digunakan di banyak MK.
- **Mata Kuliah**: Komponen dasar kurikulum yang memiliki nilai kredit (SKS), yang ditugaskan kepada seorang Koordinator untuk dievaluasi per semester.
- **Kurikulum**: Kumpulan besar Mata Kuliah, PLO, dan CLO (termasuk relasinya) yang didasarkan pada ketetapan Program Studi.

## Konteks Waktu
- **Tahun Ajaran**: Representasi siklus tahunan pendidikan (contoh: "2025/2026").
- **Semester Akademik (Ganjil/Genap)**: Pembagian dua paruh dari sebuah Tahun Ajaran berjalan. Merupakan konteks penugasan dan aktivitas sistem (contoh: "Semester Ganjil 2025/2026"). **Tidak sama** dengan Semester Kurikulum (1-8).
- **Periode (Verifikasi)**: Ruang waktu pengumpulan dan validasi soal dalam satu Semester Akademik (contoh: "UTS" atau "UAS").
- **Semester Kurikulum**: Atribut tetap (static) pada setiap Mata Kuliah (berkisar antara angka 1-8) yang mendeskripsikan di level mana mata kuliah itu normalnya diambil.

## Alur Soal
- **Soal**: Dokumen instrumen evaluasi mahasiswa yang diunggah dalam format PDF. Memiliki konteks spesifik: Mata Kuliah, Kategori, Periode, Uploader, Versi/Revisi, dan Status.
- **Verifikasi**: Tindakan yang dilakukan oleh Verifikator atas suatu Soal untuk memutuskan apakah soal itu ditolak, direvisi, atau disetujui.
- **Revisi**: Dokumen soal perbaikan yang diunggah ulang oleh Koordinator. Revisi tidak menghapus riwayat soal sebelumnya (increment *version*).
- **Berita Acara**: Rekapitulasi hasil verifikasi pada tingkat **Mata Kuliah + Periode** (bukan per Soal individual). Mencakup status *Approved*, *Revision*, *Rejected*.

## Status Soal
- **DRAFT**: Soal baru dibuat, belum di *submit*.
- **SUBMITTED**: Soal telah dikirimkan oleh Koordinator kepada Verifikator.
- **IN_REVIEW**: Soal sedang ditinjau oleh Verifikator.
- **APPROVED**: Soal telah dinyatakan layak.
- **REVISION**: Soal perlu perbaikan. Mengakibatkan *trigger* bagi Koordinator untuk mengunggah Revisi (berlanjut kembali ke *RESUBMITTED*).
- **REJECTED**: Soal ditolak, mungkin perlu pembatalan atau penggantian drastis.
- **RESUBMITTED**: Soal revisi yang dikirim ulang.
