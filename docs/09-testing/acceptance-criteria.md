# Acceptance Criteria & Traceability

Dokumen ini mendefinisikan *Acceptance Criteria* (Kriteria Penerimaan) berbasis format BDD (Behavior-Driven Development) `Given-When-Then` untuk memvalidasi pemenuhan fitur bisnis.

## 1. Assignment (Penugasan)
### AC-ASSIGN-01: Penggantian Koordinator MK
- **Given** MK "Kalkulus" memiliki Koordinator "Dosen A" pada Semester Ganjil.
- **And** "Dosen A" telah mengunggah satu soal draft.
- **When** Super Admin mengganti Koordinator menjadi "Dosen B" untuk semester yang sama.
- **Then** penugasan "Dosen A" ditandai selesai (Ended),
- **And** "Dosen B" menjadi Koordinator aktif,
- **And** "Dosen B" dapat melihat dan merevisi soal draft yang sebelumnya diunggah oleh "Dosen A".

## 2. Upload (Unggah Soal)
### AC-UPLOAD-01: Validasi Akses Kepemilikan Soal
- **Given** Dosen X adalah Koordinator MK "Fisika", dan Dosen Y adalah Koordinator MK "Biologi".
- **When** Dosen X mencoba mengunggah soal untuk MK "Biologi" lewat API atau memanipulasi *dropdown*.
- **Then** sistem harus menolak permintaan dengan kode HTTP 403 Forbidden.

## 3. Verification & Revision
### AC-VERIFY-01: Transisi Status Verifikasi dan Revisi Berkelanjutan
- **Given** Dosen Z adalah Verifikator untuk soal MK "Algoritma" yang berstatus `SUBMITTED`.
- **When** Dosen Z memberikan status `REVISION` dengan catatan "Kurang bobot penilaian".
- **Then** status soal berubah menjadi `REVISION`.
- **When** Koordinator MK mengunggah PDF perbaikan baru,
- **Then** berkas PDF lama (versi 1) tetap tersimpan, berkas baru menjadi versi 2, dan status otomatis menjadi `RESUBMITTED` atau `SUBMITTED` kembali untuk ditinjau oleh Verifikator.

## 4. Berita Acara (BA)
### AC-BA-01: Cetak Berita Acara Tanpa Bergantung Mode Dev
- **Given** aplikasi berjalan pada mode Production (`APP_ENV=production`).
- **When** Verifikator mengeklik "Cetak Berita Acara" untuk MK "Algoritma" di "Periode UTS".
- **Then** file PDF ter-generate mencakup seluruh soal MK Algoritma periode UTS dengan rasio status akhir,
- **And** PDF tidak memunculkan error atau terblokir hanya karena bukan dalam Dev Mode.

## 5. Dashboard & Monitoring
### AC-MONITOR-01: Isolasi Data Semester Berjalan
- **Given** terdapat 50 soal di-upload pada Semester Genap tahun lalu.
- **And** terdapat 10 soal di-upload pada Semester Ganjil berjalan.
- **When** pengguna membuka Dashboard tanpa memilih filter apa pun.
- **Then** widget metrik hanya menghitung 10 soal untuk kelengkapan data, mengabaikan data 50 soal tahun lalu sama sekali.

## 6. Import Data Kurikulum
### AC-IMPORT-01: Idempotency Duplikasi Data CLO Mapping
- **Given** database belum memiliki pemetaan CLO "PLO01-CLO01" ke MK "Algoritma".
- **When** Super Admin mengunggah file Excel CLO di mana baris 10 dan baris 11 tak sengaja memuat duplikat relasi yang sama.
- **Then** sistem berhasil melakukan import dengan menyimpan satu relasi tunggal tanpa *crash/exception*.

---

## 7. Traceability Matrix

| Functional Req | Business Rule | Tabel / DB | API Endpoint | Acceptance Criteria |
|---|---|---|---|---|
| FR-IMPORT-001 | BR-ACADEMIC-001 | `courses`, `plos`, `clos` | `POST /import` (Wizard) | AC-IMPORT-01 |
| FR-ASSIGN-001 | BR-ASSIGN-001, BR-ASSIGN-002 | `koordinator_assignments` | `POST` & `PUT /koordinator-assignments` | AC-ASSIGN-01 |
| FR-SOAL-002 | BR-SOAL-001 | `soal` | `POST /soal` | AC-UPLOAD-01 |
| FR-VERIFY-001 | BR-VERIFY-002 | `soal`, `verifikasi` | `POST /soal/{id}/verifikasi` | AC-VERIFY-01 |
| FR-REVISION-001 | BR-SOAL-003 | `soal` | `POST /soal/{id}/revisi` | AC-VERIFY-01 |
| FR-BA-001 | BR-BA-001, BR-BA-002 | (Generate Report PDF) | `GET /berita-acara/export` | AC-BA-01 |
| FR-MONITOR-001 | BR-MONITOR-001 | (Aggregates) | `GET /dashboard-stats` | AC-MONITOR-01 |
