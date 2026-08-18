# Screen Requirements

Spesifikasi kebutuhan layar (UI Screens) yang krusial bagi operasional bisnis. Desain spesifik harus mengimplementasikan komponen-komponen berikut:

## 1. Halaman Login
- **Komponen**: Form email dan password. Tombol "Show/Hide Password". Handling pesan error (contoh: Kredensial tidak valid).

## 2. Dashboard
- **Konteks**: Layar harus memberikan indikasi visual yang jelas mengenai "Semester Akademik & Periode (UTS/UAS) Berjalan" di sudut atas.
- **Komponen Super Admin**: Metrik Agregat (Rasio kelengkapan unggah 52 MK, Pie chart status verifikasi).
- **Komponen Dosen**: Hanya metrik dari tugas (assignment) mereka.

## 3. Import Kurikulum (Super Admin)
- **Flow Layout**: Desain berbentuk *Stepper* atau *Wizard* (Langkah 1: MK -> Langkah 2: Kategori -> dst).
- **Feedback**: Jika *upload* gagal, layar harus memunculkan daftar error validasi per baris (contoh: "Baris 14: SKS tidak boleh negatif").

## 4. Penugasan Koordinator (Super Admin)
- **Tabel Utama**: Menampilkan Daftar MK dengan indikator "Koordinator Aktif saat ini" (atau Kosong).
- **Form Edit/Ubah**: Sebuah dialog/modal yang memungkinkan pemilihan nama Dosen baru dengan keterangan bahwa "mengganti Koordinator tidak akan menghapus berkas yang telah dikumpulkan Koordinator lama".

## 5. Layar Verifikasi Soal (Verifikator)
- **Preview Panel**: Penampil dokumen PDF terintegrasi (*embedded viewer*) atau minimal tombol Unduh yang jelas.
- **Decision Panel**: Tiga tombol *Radio* atau *Action Buttons* yang membedakan warna secara intuitif:
  - `Approved` (Hijau)
  - `Revision` (Kuning/Oranye)
  - `Rejected` (Merah)
- **Text Area**: "Catatan Verifikator". Bersifat *Required* jika tombol Revision/Rejected dipilih.

## 6. Status & Revisi Soal (Koordinator)
- **Timeline / History Log**: Layar harus mampu merender jejak riwayat verifikasi. Misalnya:
  1. *Senin, 10:00* - Diunggah (v1).
  2. *Selasa, 14:00* - REVISION oleh Verifikator (Catatan: "Tambahkan bobot nilai").
  3. *Rabu, 08:00* - Diunggah Revisi (v2).
- **Tombol Aksi**: Tombol "Unggah Revisi" hanya aktif/muncul ketika status saat ini adalah `REVISION`.
