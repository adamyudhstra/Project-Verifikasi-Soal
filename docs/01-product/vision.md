# Vision Document
## Sistem Verifikasi Soal Ujian (Website Verifikator)

### 1. Problem Statement
Proses verifikasi soal ujian pada Program Studi S1 Sistem Informasi sebelumnya masih banyak menggunakan proses manual atau tersebar dalam dokumen terpisah. Hal ini menyulitkan:
- Pengelolaan master data akademik secara terpusat.
- Pelacakan tanggung jawab dosen untuk mata kuliah tertentu pada semester akademik berjalan.
- Pemantauan status pengerjaan soal dan proses verifikasinya secara *real-time*.
- Pembuatan laporan atau berita acara yang tervalidasi secara otomatis dari hasil verifikasi berjenjang.

### 2. Target Users
Sistem dirancang untuk tiga kelompok pengguna utama:
- **Super Admin**: Memerlukan akses penuh untuk pengelolaan master data, penugasan, dan pengawasan operasional seluruh semester akademik.
- **Koordinator**: Dosen yang ditugaskan bertanggung jawab penuh atas kualitas dan pengunggahan soal untuk Mata Kuliah spesifik yang dibebankan kepadanya.
- **Verifikator**: Dosen penjamin mutu yang bertugas memeriksa kesesuaian soal sebelum digunakan.

*(Catatan: Terminologi "PIC" telah ditinggalkan untuk menghindari ambiguitas tanggung jawab.)*

### 3. Value Proposition
Aplikasi ini menyatukan proses penugasan, pengunggahan, verifikasi, dan revisi soal dalam satu *Single Source of Truth*. 
Dengan sistem ini, histori verifikasi dapat diakses kapan pun secara transparan, perubahan tanggung jawab dosen (Koordinator) tidak menghilangkan jejak dokumen masa lalu, dan *Berita Acara* terjamin dibuat berdasarkan data yang kredibel dari sistem.

### 4. Stakeholders
- Program Studi S1 Sistem Informasi (Pengelola akademik).
- Dosen (sebagai Koordinator dan/atau Verifikator).

### 5. Expected Outcome
- Berkurangnya proses pengawasan manual dan administrasi kertas.
- Meminimalkan kesalahan manusia dalam penentuan status validasi soal.
- *Traceability* yang tinggi dari setiap dokumen ujian (siapa yang membuat, merevisi, memverifikasi, beserta catatan perbaikannya).
- Dukungan terhadap penerapan prinsip *Outcome-Based Education* (OBE) melalui pemetaan soal terhadap *Course Learning Outcomes* (CLO).
