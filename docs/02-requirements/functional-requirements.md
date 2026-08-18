# Functional Requirements

Dokumen ini menjelaskan semua fitur spesifik (kebutuhan fungsional) yang harus tersedia di Website Verifikator. Setiap kebutuhan harus memenuhi standar ID, *Actor*, *Preconditions*, dan kriteria penerimaan.

## Authentication & Authorization
### FR-AUTH-001: Pengguna Masuk ke Sistem (Login)
- **Description**: Sistem harus memfasilitasi pengguna untuk masuk (login) menggunakan email dan password kampus.
- **Actor**: Semua (Super Admin, Koordinator, Verifikator)
- **Preconditions**: Akun email terdaftar di database `users`.
- **Main Flow**: Pengguna memasukkan email dan password -> Klik Login -> Sistem memverifikasi kredensial -> Masuk ke Dashboard masing-masing role.
- **Acceptance Criteria**: Gagal login dengan email/password salah. Berhasil login membawa ke dashboard yang sesuai dengan rolenya.

### FR-AUTH-002: Role-based Authorization
- **Description**: Sistem membatasi menu dan endpoint API berdasarkan 3 role (Super Admin, Koordinator, Verifikator).
- **Actor**: Semua
- **Preconditions**: Session valid dengan *role* aktif.
- **Main Flow**: Mengakses endpoint/halaman -> Middleware memeriksa *role* -> Jika sesuai, diberikan akses. Jika tidak, dilarang (HTTP 403).
- **Acceptance Criteria**: Koordinator tidak bisa mengakses halaman penugasan Super Admin. Verifikator tidak bisa mengakses pengunggahan soal.

## Manajemen Akademik & Import
### FR-IMPORT-001: Import Data Kurikulum (Bulk)
- **Description**: Sistem menyediakan *wizard* untuk mengimpor Mata Kuliah, Kategori, PLO, dan CLO Mapping dari format Excel.
- **Actor**: Super Admin
- **Preconditions**: File Excel sesuai format template (`CurriculumImportService`).
- **Main Flow**: Akses menu import -> Unggah File MK -> Unggah File Kategori -> Unggah File PLO -> Unggah File CLO Mapping -> Sistem memvalidasi dan memproses dalam satu transaksi -> Tampilkan pesan sukses/gagal.
- **Alternative Flow**: Jika satu *step* gagal format, tampilkan list error baris Excel dan gagalkan semua *transaction*.
- **Acceptance Criteria**: Data baru tertambah/ter-update; Mapping CLO masuk ke `CourseCloAssignment`.
- **Dependencies**: FR-ACADEMIC-001, FR-ACADEMIC-002

### FR-ACADEMIC-001: Lihat Daftar Mata Kuliah
- **Description**: Menampilkan seluruh Mata Kuliah (SKS, Kategori, Semester Kurikulum).
- **Actor**: Super Admin
- **Preconditions**: Data MK telah di-import.
- **Acceptance Criteria**: Terdapat tabel daftar MK, dapat dicari berdasarkan kode atau nama.

### FR-ACADEMIC-002: Lihat Daftar PLO dan Pemetaan CLO
- **Description**: Menampilkan daftar PLO, dan rincian CLO yang dipetakan ke dalam berbagai Mata Kuliah (Many-to-Many).
- **Actor**: Super Admin
- **Preconditions**: Data PLO & CLO Mapping telah di-import.
- **Acceptance Criteria**: Menampilkan daftar PLO. Klik PLO menampilkan detail CLO dan MK terkait.

## Manajemen Penugasan
### FR-ASSIGN-001: Menugaskan Koordinator MK
- **Description**: Super Admin menetapkan Koordinator untuk Mata Kuliah spesifik di Semester Akademik.
- **Actor**: Super Admin
- **Preconditions**: MK aktif. Akun Dosen (Koordinator) tersedia.
- **Main Flow**: Pilih MK -> Pilih Dosen -> Set sebagai Koordinator -> Simpan.
- **Alternative Flow**: Jika MK sudah punya Koordinator, Super Admin dapat menggantinya (mengupdate data tanpa menghapus histori lama).
- **Acceptance Criteria**: Assignment baru masuk ke `koordinator_assignments`. Unique constraint `(course_id, semester_id)` terpenuhi.
- **Dependencies**: FR-ACADEMIC-001

### FR-ASSIGN-002: Menugaskan Verifikator
- **Description**: Super Admin menugaskan dosen sebagai Verifikator.
- **Actor**: Super Admin
- **Preconditions**: MK aktif. Akun Dosen tersedia.
- **Main Flow**: Pilih MK -> Tunjuk Dosen Verifikator -> Simpan.
- **Acceptance Criteria**: Verifikator ter-assign. Dapat mengakses soal di MK tersebut.

## Manajemen Soal (Koordinator)
### FR-SOAL-001: Mengunduh Template Soal
- **Description**: Koordinator dapat mengunduh dokumen template soal (PDF/Word).
- **Actor**: Koordinator
- **Preconditions**: Penugasan Koordinator valid.
- **Acceptance Criteria**: File terunduh sesuai kategori soal (mis: MKWP/MKWU).

### FR-SOAL-002: Mengunggah Soal Ujian
- **Description**: Koordinator mengunggah soal dalam format dokumen PDF.
- **Actor**: Koordinator
- **Preconditions**: Ditugaskan di MK terkait, Periode Verifikasi sedang aktif (belum deadline).
- **Main Flow**: Buka unggah soal -> Pilih MK (hanya MK yang ditugaskan) -> Pilih Periode -> Pilih file PDF -> Unggah.
- **Acceptance Criteria**: Soal tersimpan, status DRAFT/SUBMITTED, versi 1. Tersedia bagi Verifikator.

### FR-REVISION-001: Mengunggah Revisi Soal
- **Description**: Koordinator mengunggah soal baru sebagai respons dari status "REVISION".
- **Actor**: Koordinator
- **Preconditions**: Soal berstatus REVISION.
- **Main Flow**: Buka detail soal -> Unggah Revisi -> Status kembali ke SUBMITTED, versi ++.
- **Acceptance Criteria**: Riwayat soal asli (versi 1) tidak tertimpa/terhapus secara fisik maupun database. Versi 2 menjadi *active record*.

## Verifikasi (Verifikator)
### FR-VERIFY-001: Memverifikasi Soal
- **Description**: Verifikator memeriksa dan memutuskan nasib sebuah soal ujian (Approved, Revision, atau Rejected).
- **Actor**: Verifikator
- **Preconditions**: Memiliki penugasan verifikator di MK terkait. Soal berstatus SUBMITTED.
- **Main Flow**: Buka Detail Soal -> Unduh/Preview PDF -> Berikan Status -> Berikan Catatan (Opsional, Wajib jika Revision/Reject) -> Simpan.
- **Acceptance Criteria**: Status soal di-update. Riwayat verifikasi (actor, action, note) tersimpan.

## Laporan & Monitoring
### FR-BA-001: Cetak Berita Acara
- **Description**: Meng-generate Berita Acara verifikasi soal.
- **Actor**: Verifikator (atau Super Admin)
- **Preconditions**: Verifikasi telah selesai (atau sebagian selesai) untuk suatu MK di suatu Periode Akademik.
- **Main Flow**: Klik "Cetak Berita Acara" -> Sistem membuat PDF rangkuman status seluruh soal MK tersebut pada periode itu.
- **Acceptance Criteria**: PDF mencantumkan nama Koordinator, Verifikator, jumlah Approve/Revision, dan *timestamp*. Tidak bergantung pada Dev Mode.

### FR-MONITOR-001: Dashboard Semester Berjalan
- **Description**: Menampilkan statistik *upload* dan verifikasi.
- **Actor**: Super Admin, Koordinator, Verifikator.
- **Preconditions**: Semester dan Periode aktif.
- **Main Flow**: Buka halaman Dashboard -> Tampil Chart/Metriks berdasar semester dan periode *current*.
- **Acceptance Criteria**: Tidak mencampur aduk data semester lampau ke dalam metrik semester berjalan kecuali diminta eksplisit. Tooltip lawas yang *obsolete* tidak ditampilkan.
