# Verification Workflow

## Memverifikasi Soal Ujian

**Actor**: Verifikator
**Precondition**: Terdapat soal di sistem dengan status `SUBMITTED` pada Mata Kuliah (MK) yang ditugaskan kepada Verifikator tersebut.

```text
Verifikator
  ↓ Membuka panel "Antrean Verifikasi"
Action
  ↓ Pilih soal dari daftar MK yang ia awasi
  ↓ Pratinjau atau Unduh PDF soal
  ↓ Tentukan Keputusan Verifikasi:
      ├─ [Pilihan 1] APPROVED
      ├─ [Pilihan 2] REVISION
      └─ [Pilihan 3] REJECTED
  ↓ Menulis Catatan Tambahan (Wajib bila Revision/Rejected)
System Validation
  ↓ Pastikan MK valid, pastikan status asal = `SUBMITTED` atau `RESUBMITTED`
State Change
  ↓ Status soal berubah sesuai keputusan.
  ↓ Histori aksi dicatat ke *audit logs* / riwayat verifikasi.
Next Action
  ↓ Jika `REVISION`, Koordinator MK diwajibkan mengunggah ulang perbaikannya (Revisi).
  ↓ Jika `APPROVED`, sistem memperbarui rekap Berita Acara (BA).
```
