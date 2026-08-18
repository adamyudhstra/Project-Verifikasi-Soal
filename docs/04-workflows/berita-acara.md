# Berita Acara Workflow

## Generate Berita Acara

**Actor**: Verifikator (atau Super Admin untuk level program studi)
**Precondition**: Status periode verifikasi telah usai (atau soal untuk suatu MK sudah 100% tuntas diverifikasi). **Tidak** bergantung pada mode *Development* aplikasi.

```text
Verifikator / Super Admin
  ↓ Membuka panel "Berita Acara"
Action
  ↓ Pilih Filter: Mata Kuliah (A) dan Periode Ujian (UTS/UAS) pada Semester Berjalan
  ↓ Klik tombol "Cetak Berita Acara"
System Validation
  ↓ Ambil jumlah total soal di MK tersebut
  ↓ Rekap jumlah status `APPROVED`, `REVISION`, `REJECTED`
State Change
  ↓ Sistem memanggil Job Background (jika PDF berat) atau men-generate stream HTML to PDF.
  ↓ Dokumen terekam.
Next Action
  ↓ Pengguna menerima file PDF formal yang mencantumkan nama Koordinator, Verifikator, jumlah dokumen yang layak ujikan, beserta rincian catatannya.
```
