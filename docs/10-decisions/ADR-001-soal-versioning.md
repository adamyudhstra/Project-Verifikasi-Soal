# ADR-001: Immutable Soal Versioning

## Konteks
Sistem Manajemen Soal sebelumnya (Phase 1 & 2) menyimpan berkas soal, versi, dan status verifikasi langsung di dalam tabel `soals`. Hal ini menyebabkan beberapa masalah ketika sebuah soal ditolak (REVISION/REJECTED) dan pengguna mengunggah berkas baru. Histori berkas lama hilang ditimpa, komentar verifikasi pada versi lama sulit ditelusuri karena menunjuk ke record soal yang sama dengan berkas baru, dan tidak ada audit trail yang komprehensif.

## Keputusan
Kita memisahkan data yang berubah (mutable) ke dalam tabel tersendiri bernama `soal_versions`. Tabel `soals` akan bertindak sebagai root entity yang tidak banyak berubah, sedangkan `soal_versions` bertindak sebagai catatan riwayat yang sifatnya append-only (immutable).

### Struktur Tabel
1. `soals`:
   - Menyimpan atribut metadata (course, semester, kategori ujian, dll).
   - Memiliki `current_version_id` yang selalu menunjuk ke entri terakhir di `soal_versions`.

2. `soal_versions`:
   - Menyimpan `soal_id`.
   - Menyimpan `version` (integer bertambah).
   - Menyimpan `file_path`.
   - Menyimpan `status` (SUBMITTED, REVISION, APPROVED, REJECTED).
   - Menyimpan `uploader_id`.
   - Sifat model: **Immutable**. Atribut `file_path` dan `version` tidak boleh di-*update* setelah dibuat. Jika ada revisi, buat record `soal_versions` baru.

### Implikasi
- Perubahan pada skema database harus dilakukan dengan backfill data yang ada.
- Verifikasi sekarang berhubungan (foreign key) dengan `soal_versions`, bukan `soals`.
- Keamanan histori terjamin dan tidak ada berkas lama yang hilang akibat tertimpa secara logis di database.

## Status
Diterima.
