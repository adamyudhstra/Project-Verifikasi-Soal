# Entity Relationship Diagram (ERD)

Desain ERD ini merupakan prioritas utama dan *Source of Truth* kedua (setelah aturan bisnis final) untuk struktur basis data sistem verifikasi soal.

> [!NOTE]
> File visual ERD dapat merujuk ke gambar `ERD.png` yang terlampir di repositori utama. Apabila ada perbedaan antara *tech-spec* lama dan ERD, **ERD memenangkan konflik**.

## Keputusan Arsitektur Database (ADR: Database Engine)
Implementasi sistem secara *development* mengadopsi SQLite, tetapi untuk *production* disepakati untuk menggunakan **PostgreSQL** karena membutuhkan dukungan *constraint* relasional yang ketat dan keamanan konkurensi (transaksi paralel, *upsert*, dsb.).

## Relasi Kritis 
Sistem mengadopsi model relasional berikut untuk menghindari redudansi historis:
1. **Assignment Terisolasi**: `koordinator_assignments` dan `penugasan_verifikator` menggunakan jembatan ke `semesters`. Artinya penugasan mengikat ke satuan waktu spesifik, dan *History* akan lestari di tabel jika pergantian Koordinator diwujudkan dengan *Insert* record baru/penghentian status yang lama.
2. **Histori Soal & Revisi**: Setiap unggahan soal revisi tidak me-replace record lama, tapi meng-insert record baru (contoh dengan identifier *version++* atau relasi child table) untuk melacak *audit trail*.
3. **Soal & CLO**: Soal tidak langsung terikat ke PLO. Alur yang benar: `Soal -> CLO -> PLO`. Hubungan `mata_kuliah_plo` tidak boleh ada (duplikasi rute/redundant), hubungan yang direstui adalah `mata_kuliah_clo` dan `clo_plo`.
