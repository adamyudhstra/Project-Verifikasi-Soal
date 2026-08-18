# Monitoring Workflow

## Dashboard Monitoring 

**Actor**: Super Admin, Koordinator, Verifikator
**Precondition**: Memiliki role akses yang sah. Terdapat data soal dan MK di *Semester Berjalan*.

```text
Actor
  ↓ Membuka halaman "Dashboard"
Action
  ↓ (Halaman otomatis merender data default ke Semester dan Periode ujian berjalan)
  ↓ Sistem menghitung rasio: [Soal Diunggah vs Total MK Wajib Unggah]
  ↓ Sistem merender grafik/ringkasan Breakdown Status (Disetujui, Revisi, dsb).
System Validation
  ↓ Filter data wajib menggunakan ID Semester Aktif, memastikan histori lama tak masuk dalam sumasi angka.
State Change
  ↓ (Read-only action, tidak ada state change)
Next Action
  ↓ Super Admin bisa melihat makro keseluruhan.
  ↓ Koordinator/Verifikator disajikan data ter-filter khusus MK miliknya saja.
```
*(Catatan: Tooltip atau Chart info yang obsolete dari desain lawas telah dihapus dari requirement.)*
