# Curriculum Import Rules

Aturan ini mengukuhkan perilaku dari `CurriculumImportService` yang sudah digunakan sebagai fondasi pengisian data akademik.

## 1. Sumber Data (Source File)
Data di-import menggunakan format dokumen **Spreadsheet (Excel .xlsx)**. Terdapat empat langkah terpisah yang bekerja secara skuensial di bawah satu payung transaksi: Mata Kuliah -> Kategori -> PLO -> CLO Mapping.

## 2. Struktur Dasar
Setiap file import harus mengandung kolom *Header* pada *Sheet* pertama yang relevan dengan tipe import.

### a. Mata Kuliah (Courses)
- **Required Columns**: `Semester`, `Kode`, `Nama MK (INA)`, `SKS`.
- **Validation**:
  - `Semester` = Angka numerik 1-14 (Fallback ke 1 jika tak lazim namun tidak error).
  - `SKS` = Angka positif 1-20 (Fallback ke 3).
  - Nama MK tidak boleh kosong.
- **Duplikasi**: Jika Kode MK sudah terpakai di database, sistem menginisiasi penambahan suffix enumeratif otomatis (contoh: `MK_1`).

### b. Kategori MK (Categories)
- **Required Columns**: `Kategori`, `Nama Mata Kuliah`.
- **Mapping**: Mencari `Course` berdasarkan kolom `Nama Mata Kuliah` (Case-Insensitive), kemudian meng-update atribut `category` (misalnya `MKWP`).

### c. PLO (Program Learning Outcome)
- **Required Columns**: `KODE PLO`, `Program Learning Outcome / Deskripsi`.
- **Validation**: Seluruh sel deskripsi wajib terisi.

### d. CLO (Course Learning Outcome) & Mapping
- **Required Columns**: `PLO`, `Kode CLO`, `CLO` (Deskripsi), `Bloom`, `MK`.
- **Perilaku Many-to-Many**: Karena satu CLO dapat diterapkan ke berbagai MK, file excel menampung nama-nama MK ke baris majemuk.
- **Idempotency**: Menggunakan metode `firstOrCreate` terhadap kombinasi `(course_id, clo_number)` sehingga jika terdapat baris duplikat mapping pada excel, sistem tidak memicu exception *database integrity*.

## 3. Penanganan Eksepsi dan *Rollback*
- **Sifat Transaksional**: Keseluruhan proses ini dibungkus *DB::transaction*. Kegagalan pada file CLO akan menyebabkan data Mata Kuliah dan PLO yang telah berhasil di-parse sebelumnya **di-rollback** (dibatalkan seluruhnya) demi menjaga keutuhan struktur.
- **Partial Success**: DILARANG.
- **Laporan Error**: Format error harus mengembalikan informasi spesifik berformat `Baris {n}: Pesan Kesalahan` kepada pengguna (Super Admin) agar koreksi bisa tepat sasaran.
