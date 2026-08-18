# Sistem Verifikasi Soal Ujian (Website Verifikator)

## Tujuan Sistem
Sistem Informasi Verifikasi Soal adalah aplikasi berbasis web untuk mengelola proses pengunggahan, penugasan, verifikasi, revisi, pemantauan status, dan pembuatan berita acara soal secara terstruktur untuk Program Studi S1 Sistem Informasi di Telkom University.

## Pengguna (Roles)
Sistem ini menggunakan tiga role secara eksklusif:
1. **Super Admin**: Pengelola utama sistem, mengelola master data via import, menetapkan penugasan, dan melihat seluruh status verifikasi.
2. **Koordinator**: Dosen yang ditugaskan mengelola soal untuk Mata Kuliah tertentu pada Semester Akademik berjalan.
3. **Verifikator**: Dosen yang ditugaskan melakukan verifikasi (Approved/Revision/Rejected) terhadap soal yang diunggah Koordinator.

*(Catatan: Terminologi "PIC" sudah dihapuskan dari requirement final sistem ini.)*

## Source of Truth
Dokumentasi ini telah direkonsiliasi dan merupakan satu-satunya *source of truth* untuk pengembangan sistem. Hierarki kebenaran apabila terdapat inkonsistensi:
1. Keputusan bisnis final (Notulen/Aturan Bisnis di folder `02-requirements`).
2. Struktur Database (ERD di folder `05-data`).
3. Struktur akademik resmi Telkom University (Sistem OBE).
4. Data akademik aktual dari program studi.
5. Implementasi aktual dari repositori saat ini.

## Struktur Dokumentasi
Dokumentasi dibagi menjadi beberapa bagian utama:

- **[01-product](./01-product/)**: Visi, batasan cakupan (scope), dan glosarium.
- **[02-requirements](./02-requirements/)**: Kebutuhan fungsional, non-fungsional, dan aturan bisnis final.
- **[03-academic](./03-academic/)**: Model OBE, struktur akademik, dan aturan data.
- **[04-workflows](./04-workflows/)**: Alur kerja sistem (assignment, upload, verifikasi, berita acara).
- **[05-data](./05-data/)**: Desain database (ERD), model data, kamus data, dan aturan impor Excel.
- **[06-api](./06-api/)**: Dokumentasi overview dan spesifikasi endpoint API.
- **[07-ui](./07-ui/)**: Arsitektur informasi dan aturan/kebutuhan antarmuka pengguna.
- **[08-security](./08-security/)**: Aturan autentikasi, otorisasi, dan audit log.
- **[09-testing](./09-testing/)**: Kriteria penerimaan (Acceptance Criteria) untuk pengujian.
- **[10-decisions](./10-decisions/)**: Keputusan arsitektur final dan hal-hal yang belum diputuskan (open decisions).
- **[99-archive](./99-archive/)**: Arsip dokumen lama (`PRD.md`, `tech-spec.md`, dll.) yang sudah **tidak lagi menjadi source of truth**.

## Cara Membaca Dokumentasi
- Mulailah dari [glossary.md](./01-product/glossary.md) untuk memahami istilah-istilah yang disepakati.
- Pelajari [business-rules.md](./02-requirements/business-rules.md) untuk memahami batasan sistem yang kaku.
- Lanjutkan ke [erd.md](./05-data/erd.md) dan [data-model.md](./05-data/data-model.md) untuk melihat representasi sistem secara teknis.
- Tinjau masing-masing alur di `04-workflows/` untuk melihat bagaimana pengguna berinteraksi dengan sistem berdasarkan aturan yang berlaku.

## Status Dokumentasi
**Status: FINALIZED**
Seluruh dokumen dalam direktori ini (kecuali `99-archive`) telah diverifikasi dan disesuaikan untuk tidak memiliki kontradiksi satu sama lain.
