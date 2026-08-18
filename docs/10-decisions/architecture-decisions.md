# Architecture & Design Decisions (ADR)

Dokumen ini mencatat keputusan-keputusan final yang sangat mendasar bagi sistem. Keputusan ini **TIDAK BOLEH DIBATALKAN** tanpa evaluasi ulang skala besar.

## ADR-01: ERD Sebagai Source of Truth Data Model
- **Context**: Terdapat inkonsistensi antara `tech-spec.md` lama (yang tidak memuat beberapa tabel krusial seperti histori `verifikasi`) dengan file `ERD.png` dan *use-case*.
- **Decision**: Mulai sekarang, struktur basis data HANYA mengacu pada dokumen di `05-data/erd.md` dan implementasi aktual migrasi Laravel.
- **Consequences**: Seluruh tim backend harus mengubah API yang tadinya *hardcode* agar 100% mematuhi relasi di ERD (misalnya: tidak ada lagi foreign key ganda yang mem-bypass relasi MK -> CLO).
- **Status**: **FINAL**

## ADR-02: Pemisahan Semester Akademik vs Semester Kurikulum
- **Context**: Keduanya sebelumnya sering bertabrakan penamaannya.
- **Decision**: "Semester Kurikulum" 1-8 dijadikan field statis di `courses`. Sedangkan "Semester Akademik" (Ganjil/Genap berjalan) dikelola dalam tabel `semesters` yang menjadi induk dari segala `assignments` dan `soal`.
- **Consequences**: UI Dashboard wajib di-*filter* berdasarkan `semesters` id yang aktif, bukan berdasarkan urutan `courses.semester`.
- **Status**: **FINAL**

## ADR-03: Terminologi & Penghapusan Fitur
- **Context**: Dokumen lama membingungkan antara "Koordinator", "PIC", serta memunculkan ide "Penetapan Nilai PLO".
- **Decision**: 
  1. Istilah PIC dihapus selamanya, diganti dengan **Koordinator**.
  2. Fitur *Penetapan Nilai PLO* dibuang secara penuh dari Scope (Dibatalkan).
- **Consequences**: Pengurangan kompleksitas UI/UX dan basis data.
- **Status**: **FINAL**

## ADR-04: Berita Acara & Dev Mode
- **Context**: Mekanisme awal mengaitkan Berita Acara (BA) per-satu soal tunggal dan konon memiliki *dependency* pada status "Dev Mode" agar bisa diunduh.
- **Decision**: BA di-generate di tingkat aggregasi **Satu Mata Kuliah pada Satu Periode (UTS/UAS)**. Fitur eksport tidak boleh punya *blocker* berbasis environment variable `dev_mode`.
- **Consequences**: Format dokumen BA harus disusun sebagai sebuah *Report Summary* tabel-tabel per MK.
- **Status**: **FINAL**

## ADR-05: Penanganan Jejak Koordinator
- **Context**: Ketakutan soal terhapus saat Koordinator berganti di tengah jalan.
- **Decision**: Assignment memakai status `ACTIVE`/`ENDED` (atau konsep log insert only). Jangan menimpa (overwrite) FK user dari soal yang sudah jadi.
- **Status**: **FINAL**

## ADR-06: Arsitektur Repositori (Monorepo Modular Monolith)
- **Context**: Kebutuhan untuk menetapkan batasan dan struktur direktori proyek skala internal yang bersih antara *frontend* dan *backend* tanpa kompleksitas *Microservices* yang berlebihan.
- **Decision**: Menggunakan **Monorepo Modular Monolith**. Sistem dibagi secara eksplisit menjadi `apps/web` (React 19 + TypeScript + Vite + TailwindCSS 4 + React Router 7) dan `apps/api` (Laravel 12 + PHP 8.2 + Sanctum). Seluruh sistem berpusat pada satu database tunggal yakni **PostgreSQL**.
- **Consequences**: Tidak boleh ada pemisahan servis mikroskopik. Semua *business logic* backend berjalan dalam satu basis kode utama. *Workspace tooling* bawaan atau *shared packages* dilarang secara *default* karena hanya ada dua aplikasi yang tidak berbagi kode lintas *environment*.
- **Status**: **FINAL**
