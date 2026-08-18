# Academic Data Rules

Aturan master data akademik (S1 Sistem Informasi) ini mengacu pada berkas Excel aktual dan mekanisme `CurriculumImportService`. Jangan mengarang data referensi.

## 1. Skala Data Akademik (Evidence-based)
Berdasarkan data referensi Excel aktual (`Mata_Kuliah_Sistem_Informasi_Semester_1-8.xlsx`, `PLO_CLO_MK_Mapping.xlsx`, dsb.):

- **Mata Kuliah**: Terdapat **52 MK** unik (Semester 1–8, termasuk MBKM dan Pilihan).
- **PLO (Program Learning Outcome)**: Terdiri dari **10 PLO** (PLO01 - PLO10).
- **CLO (Course Learning Outcome)**: Terdapat **36 CLO** unik yang memetakan ke PLO (bukan "40+"). Format kode umumnya `PLOxx-CLOyy`.
- **Dosen**: Terdiri dari **20 Dosen Tetap Prodi** (NJFA, Asisten Ahli, Lektor), **2 Dosen Tetap Pegawai** non-prodi, dan sekitar **7–13 Dosen Luar Biasa** tiap semester. Kode dosen berbentuk 3 huruf unik.

## 2. Resolusi Kesenjangan Data (Open Data Issues)
Ditemukan beberapa inkonsistensi dari arsip *spreadsheet* lokal yang harus ditangani sistem:
- Ada inkonsistensi penamaan "Agama" di MK.
- Labeling *Bloom's Taxonomy* ada yang bertuliskan "Analyse" maupun "Analyze". *Rule*: Sistem harus membakukan penamaan saat import, dengan *case-insensitive matching* pada importir.
- Duplikasi *mapping* CLO pada sumber asli. *Rule*: Algoritma import (`CurriculumImportService`) akan melakukan `firstOrCreate` atau UPSERT untuk mencegah konflik *database unique constraint*.

## 3. Asumsi Pendukung
Kecuali didefinisikan secara resmi (Hardcoded), setiap hal yang bersifat *unknown* (tidak ada referensinya di Repo atau Excel, misal NIDN, detil JFA spesifik, atau Email official) tidak boleh direkayasa sendiri. Gunakan penanda `UNKNOWN` atau buat mekanisme kolom opsional (`nullable`).
