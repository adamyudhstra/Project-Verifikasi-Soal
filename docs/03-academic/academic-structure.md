# Academic Structure & Time Model

Pemodelan waktu dan penugasan adalah fondasi aplikasi Verifikasi Soal. Sistem ini membedakan secara kaku antara *Waktu Kurikulum* dan *Waktu Pelaksanaan Akademik*.

## 1. Hierarki Waktu Pelaksanaan (Akademik)
Waktu aktual di mana sistem beroperasi dan tugas-tugas (assignment) diberikan.

```text
Tahun Ajaran (misal: 2025/2026)
    │
    ├── Semester Akademik Ganjil
    │       │
    │       ├── Periode UTS (Ujian Tengah Semester)
    │       └── Periode UAS (Ujian Akhir Semester)
    │
    └── Semester Akademik Genap
            │
            ├── Periode UTS
            └── Periode UAS
```
*Aturan Eksekusi:*
- **Semester Akademik**: Digunakan sebagai dasar penugasan (Assignment) Koordinator dan Verifikator. Jika dosen ditugaskan pada "Semester Akademik Ganjil 2025/2026", maka mereka bertanggung jawab atas soal UTS dan UAS pada paruh waktu tersebut.
- **Periode Ujian (UTS/UAS)**: Opsi kategori soal ujian ini diotomatisasi sistem agar selalu mengikuti "Periode Aktif" berjalan. Tidak diperkenankan bagi user untuk memilih sendiri secara keliru. Dashboard monitoring pun berakar pada *Periode* ini.

## 2. Atribut Waktu Statis (Semester Kurikulum)
```text
Mata Kuliah
    └── semester_kurikulum = 1..8
```
*Aturan Eksekusi:*
- Atribut `semester_kurikulum` hanyalah penanda bawaan dari profil Mata Kuliah (contoh: "Kalkulus" adalah MK Semester 1).
- Hal ini **TIDAK SAMA** dan **TIDAK BOLEH DICAMPURADUKKAN** dengan *Semester Akademik Ganjil/Genap*.

## 3. Model Penugasan & Histori (Assignment Model)
Karena Koordinator MK bisa berganti tiap semesternya, rekam jejak riwayat tidak boleh saling menimpa (*overwrite*).

```text
Mata Kuliah
     │
     └── Penugasan Koordinator (koordinator_assignments)
              │
              ├── Dosen Terpilih
              ├── Semester Akademik
              ├── Start (Waktu Mulai)
              ├── End (Waktu Berakhir)
              └── Status
```

### Transisi Pergantian Koordinator
Apabila User 1 digantikan oleh User 2 pada semester yang sama, maka skemanya:
```text
User 1 (Koordinator Lama)
   ↓
Assignment Ended (Rekam jejak tertahan/tersimpan)

User 2 (Koordinator Baru)
   ↓
Assignment Active (Meneruskan sisa tugas)
```
*Catatan: Semua soal (baik yang berstatus Draft, Revision, maupun Approved) yang diunggah oleh User 1 sebelumnya tetap menjadi arsip valid untuk Mata Kuliah & Periode bersangkutan.*
