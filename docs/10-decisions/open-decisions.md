# Open Decisions (Belum Diputuskan)

Dokumen ini mencatat masalah-masalah teknis maupun operasional yang masih belum menemukan titik terang atau bukti otentik dari referensi resmi.

### OD-01: Detail Otomatisasi Surel (Email Automation)
- **Question**: Apakah sistem Verifikasi Soal harus mengirimkan notifikasi Email kepada Verifikator saat Koordinator mengubah status menjadi `SUBMITTED`, atau cukup lewat notifikasi *in-app* dashboard?
- **Why it matters**: Jika butuh Email otomatis, arsitektur *Mail Queues* via *SMTP Telkom University* harus di-setup di `.env` dan membutuhkan infrastruktur tambahan (Redis/Database queues).
- **Current evidence**: Dokumen lawas dan notulen tidak menyinggung fitur surel (Email).
- **Options**:
  1. Abaikan integrasi surel (Fokus Dashboard UI saja).
  2. Integrasi SMTP Email.
- **Recommended decision**: Opsi 1 (Fokus Dashboard), agar ruang lingkup rilis tidak membengkak.
- **Owner**: Product Owner / Kaprodi.
- **Status**: **OPEN DECISION**

### OD-02: Data Eksak NIDN & Email Resmi Dosen Luar Biasa (LB)
- **Question**: Jumlah pasti Dosen LB berfluktuasi (7-13). Saat import data, format surel (`email`) apa yang dijadikan cadangan (*fallback*) apabila Dosen LB tidak memiliki/belum mendapatkan email resmi kampus?
- **Why it matters**: `users.email` adalah elemen krusial dan wajib *Unique* di sistem *authentication*.
- **Current evidence**: File Excel *"List Nama Dosen Prodi & Dosen LB Prodi S1 Sistem Informasi TUKJ_2026.xlsx"* tidak memiliki rincian format email baku para Dosen LB tersebut.
- **Options**:
  1. Memaksa harus punya akun resmi `@telkomuniversity.ac.id`.
  2. Membolehkan akun email personal (misal: `@gmail.com`).
- **Recommended decision**: Menggunakan akun resmi, jika tidak ada, akun dibuat dengan domain alias oleh Super Admin (mis: `dosenLB123@internal.verifikator`).
- **Owner**: Super Admin / Kepegawaian Prodi.
- **Status**: **DATA GAP**
