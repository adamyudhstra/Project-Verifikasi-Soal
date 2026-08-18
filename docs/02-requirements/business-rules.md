# Business Rules

Dokumen ini mendefinisikan seluruh aturan bisnis final yang harus ditaati secara ketat oleh *Website Verifikator*. Setiap rule bersifat atomic, dapat diuji, dan tidak ambigu.

## Assignment (Penugasan)
- **BR-ASSIGN-001**: Satu Mata Kuliah HANYA BOLEH memiliki SATU Koordinator aktif untuk satu Semester Akademik secara konkuren (Unique constraint: `course_id, semester_id`).
- **BR-ASSIGN-002**: Penggantian Koordinator dari User A ke User B pada semester yang sama TIDAK BOLEH menghapus histori/rekam jejak assignment User A. User B akan mengambil alih status aktif.
- **BR-ASSIGN-003**: Super Admin tidak dapat menugaskan seorang Koordinator untuk mata kuliah yang belum di-import atau tidak ada dalam kurikulum aktif.
- **BR-ASSIGN-004**: Satu Mata Kuliah DAPAT memiliki lebih dari satu Verifikator secara bersamaan jika dibutuhkan (1-to-many pada entitas *Verifikator Assignment*).

## Kurikulum Akademik & Waktu
- **BR-ACADEMIC-001**: Kurikulum (Mata Kuliah, PLO, CLO) dianggap *given* dan terpusat berdasarkan file *Excel* kurikulum resmi. Pembuatan entitas ini di dalam sistem hanya diperbolehkan melalui proses **Import (Wizard)**.
- **BR-ACADEMIC-002**: Satu Mata Kuliah (MK) dapat dikaitkan dengan banyak CLO (Many-to-Many).
- **BR-ACADEMIC-003**: Satu CLO dapat dipetakan ke banyak PLO, dan sebaliknya (Many-to-Many), mengikuti standar *Outcome-Based Education* (OBE).
- **BR-ACADEMIC-004**: Sistem waktu dibedakan tegas menjadi:
    1. **Tahun Ajaran & Semester Akademik** (Ganjil/Genap): Digunakan sebagai *konteks aktivitas* sistem dan *assignment*.
    2. **Semester Kurikulum** (1-8): Hanya berupa *atribut statis* dari Mata Kuliah (misal: "Pemrograman Web adalah MK Semester 2").
- **BR-ACADEMIC-005**: Pilihan "Periode Ujian" (UTS/UAS) otomatis mengikuti periode verifikasi yang diaktifkan oleh Super Admin, tidak lagi dipilih secara manual dari list yang redundan.
- **BR-ACADEMIC-006**: Fitur "Penetapan Nilai PLO" tidak diizinkan berada di dalam basis data dan implementasi antar-muka.

## Alur Soal dan Verifikasi
- **BR-SOAL-001**: Koordinator hanya dapat mengunggah dan melihat soal untuk Mata Kuliah yang secara eksplisit ditugaskan kepadanya pada semester/periode berjalan.
- **BR-SOAL-002**: Verifikator hanya dapat memverifikasi soal pada Mata Kuliah yang ditugaskan kepadanya.
- **BR-SOAL-003**: Setiap unggahan **Revisi Soal** wajib meningkatkan versi (`version`) dan menciptakan baris rekaman baru (*Insert* file baru, bukan *Update/Overwrite* file lama).
- **BR-SOAL-004**: Soal harus dapat ditautkan (linked) dengan daftar CLO yang direpresentasikannya.
- **BR-VERIFY-001**: Transisi status verifikasi bersifat sekuensial. Koordinator TIDAK BISA memberikan status "Approved" pada soalnya sendiri.
- **BR-VERIFY-002**: Jika Verifikator memberikan status `REVISION` atau `REJECTED`, Verifikator **WAJIB** mengisi kolom "Catatan Verifikasi".

## Berita Acara & Monitoring
- **BR-BA-001**: Entitas *Berita Acara* di-generate pada level konteks **Mata Kuliah + Periode Akademik**, bukan pada level satu dokumen soal secara individual (satu BA merangkum seluruh soal dalam 1 MK di UTS/UAS terkait).
- **BR-BA-002**: Fitur Berita Acara harus bersifat independen dan berfungsi 100% tanpa bergantung pada mode aplikasi (*Dev Mode*).
- **BR-MONITOR-001**: Metrik di halaman Dashboard utama WAJIB dipilah secara *default* menggunakan konteks **Semester Akademik Berjalan (Aktif)**. Histori semester lampau tidak boleh merancukan persentase kelengkapan soal.
