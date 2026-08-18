# OBE Model (Outcome-Based Education)

Sistem Verifikasi Soal dibangun di atas kerangka *Outcome-Based Education* resmi Telkom University.

## 1. Struktur Relasional OBE
Sistem harus merepresentasikan hierarki dan relasi OBE sebagai berikut:

```text
Curriculum
   │
   ├── PLO (Program Learning Outcome)
   │
   └── Mata Kuliah
          │
          └── Mata Kuliah ↔ CLO (Course Learning Outcome)
                         │
                         └── CLO ↔ PLO
```

### Penjelasan Relasi:
- **Kurikulum (Curriculum)**: Pembungkus utama untuk semua data akademik.
- **Mata Kuliah**: Entitas statis yang memiliki SKS dan target Semester Kurikulum.
- **PLO**: Capaian pembelajaran program studi (biasanya ada 10 PLO).
- **CLO**: Capaian pembelajaran spesifik mata kuliah.
- **Relasi MK ke CLO**: Satu Mata Kuliah (MK) dapat memiliki lebih dari satu CLO. Relasinya adalah **Many-to-Many**.
- **Relasi CLO ke PLO**: CLO dapat dipetakan ke PLO spesifik sesuai rancangan OBE. Hubungannya **Many-to-Many**.

## 2. Model Penilaian (Assessment) & Verifikasi
Soal yang diunggah harus dapat dikaitkan dengan CLO, sehingga memvalidasi bahwa instrumen pengujian tersebut secara akurat mengukur capaian yang dirancang.

```text
Mata Kuliah
    │
    └── Soal (Instrumen Ujian)
          │
          └── Soal ↔ CLO
```
*Catatan: Sistem Verifikasi Soal **tidak** mencakup penetapan nilai/grading capaian PLO individual mahasiswa.*
