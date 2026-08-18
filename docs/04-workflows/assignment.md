# Assignment Workflow

## 1. Penetapan Koordinator MK (Baru)

**Actor**: Super Admin
**Precondition**: Mata Kuliah (MK) ada di database, Dosen terdaftar, Semester Akademik aktif telah ditentukan.

```text
Super Admin
  ↓ Membuka panel Penugasan Koordinator
Action
  ↓ Memilih Mata Kuliah (A) dan Semester Akademik (S)
  ↓ Menunjuk User (X)
System Validation
  ↓ Pastikan (A, S) belum memiliki Koordinator aktif
State Change
  ↓ Insert ke `koordinator_assignments` dengan `user_id = X`
Next Action
  ↓ User (X) langsung mendapatkan hak menu pengunggahan soal untuk MK (A) di semester (S)
```

## 2. Penggantian (Replacement) Koordinator

**Actor**: Super Admin
**Precondition**: Koordinator lama (User X) sudah bertugas di MK (A) untuk Semester (S).

```text
Super Admin
  ↓ Memilih tugas yang sudah ada di MK (A)
Action
  ↓ Memilih "Ubah Dosen" ke User (Y)
System Validation
  ↓ Pastikan tidak ada soal yang sedang "Terkunci" pada sistem fisik, jaga data ID lama
State Change
  ↓ Assignment User (X) di-set 'Ended'
  ↓ Assignment baru untuk User (Y) dibuat untuk meneruskan
Next Action
  ↓ Hak unggah dan revisi beralih ke User (Y) tanpa menghapus berkas User (X)
```

## 3. Penugasan Verifikator

**Actor**: Super Admin
**Precondition**: Mata Kuliah (A) memiliki soal atau akan diverifikasi.

```text
Super Admin
  ↓ Membuka panel Verifikator
Action
  ↓ Pilih MK (A) -> Pilih Dosen (Z)
System Validation
  ↓ Validasi existensi MK dan Dosen
State Change
  ↓ Penugasan masuk ke tabel `penugasan_verifikator`
Next Action
  ↓ User (Z) mendapatkan antrean tugas validasi soal di MK (A)
```
