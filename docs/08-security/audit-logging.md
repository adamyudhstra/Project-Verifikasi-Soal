# Audit Logging

Pencatatan rekam jejak (Audit Log) merupakan persyaratan *non-functional* tingkat tinggi demi akuntabilitas penjaminan mutu.

## 1. Persyaratan Perekaman
Sistem harus memiliki mekanisme (baik via table terpisah `activity_logs` ataupun via paket third-party seperti *spatie/laravel-activitylog*) yang merekam aktivitas berikut:

1. **Autentikasi**: Log masuk (Login) dan Gagal Login.
2. **Perubahan Role/Assignment**: Kapan Super Admin mengganti Koordinator X menjadi Y.
3. **Upload Soal**: Waktu unggah soal baru dan revisi (Koordinator).
4. **Verifikasi**: Waktu dan keputusan spesifik verifikasi oleh Verifikator (Sudah terakomodasi dalam rancangan tabel `verifikasi` atau log revisi `soal`).
5. **Import Kurikulum**: Keberhasilan dan kegagalan proses *bulk import* kurikulum oleh Super Admin.

## 2. Struktur Data Log
Setiap baris aktivitas minimal merekam:
- `timestamp` (Waktu kejadian dalam format standar UTC/Local).
- `actor_id` (Siapa yang melakukan, merujuk ke tabel `users`).
- `action` (Aksi yang dilakukan, contoh: `CREATED`, `VERIFIED`, `REJECTED`, `ASSIGNED`).
- `entity_type` & `entity_id` (Tabel/entitas yang dimanipulasi).
- `metadata` (Opsional: Payload JSON untuk catatan tambahan seperti *reason*, *IP address*, atau perubahan *state* old-new).
