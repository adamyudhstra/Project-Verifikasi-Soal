# API Overview

Website Verifikator menggunakan standar arsitektur RESTful JSON API yang dilindungi dengan *Bearer Token* berbasis Laravel Sanctum. Dokumentasi API ini merupakan sumber kebenaran final yang memisahkan antara endpoint *Implemented* dan *Planned*.

## Desain Arsitektural
1. **Response Format**: Seluruh respon dikembalikan dalam format JSON. Standarisasi menggunakan pembungkus objek dasar (contoh: `{ "data": ... }` atau `{ "message": ..., "errors": ... }`).
2. **Autentikasi**: Memanfaatkan mekanisme sesi web (Cookie-based via Sanctum untuk SPA Inertia.js/React) atau *Bearer Token* bagi klien eksternal.
3. **Validasi (FormRequest)**: Pemeriksaan *payload* wajib diisolasi pada *FormRequest* (contoh: `UploadSoalRequest`). Dilarang keras menempatkan *logic validation* dan *business* pada `routes/api.php` (*Closure Routes*).
4. **Otorisasi**: Pengecekan *permission* berdasarkan *Role* dan *Ownership/Assignment* ditangani di *Controller* atau menggunakan mekanisme *Laravel Policies* (contoh: `SoalPolicy`).

## Status Dokumentasi
- **Implemented**: API ini sudah berjalan, di-test, dan selaras dengan implementasi repositori saat ini.
- **Planned (TBD)**: API belum terimplementasi seutuhnya/masih menunggu perombakan *interface* (Misal: API generate PDF Berita Acara via Background Job).
- **Deprecated**: Endpoint lawas yang dihapus karena arsitektur baru. (Seluruh endpoint penetapan nilai PLO masuk dalam daftar ini).
