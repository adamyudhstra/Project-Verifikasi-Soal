# Revision Workflow

## Mengunggah Revisi (Perbaikan Soal)

**Actor**: Koordinator MK
**Precondition**: Verifikator telah memberikan status `REVISION` pada soal yang diunggah oleh Koordinator sebelumnya.

```text
Koordinator MK
  ↓ Membuka notifikasi / panel "Status Verifikasi"
Action
  ↓ Melihat Catatan Revisi dari Verifikator pada file lama
  ↓ Klik "Unggah Revisi"
  ↓ Mengunggah PDF File Baru yang sudah diperbaiki
System Validation
  ↓ Pastikan soal berstatus `REVISION`
State Change
  ↓ Soal lama dipertahankan secara fisik dengan ID versinya (Misal: v1)
  ↓ Row revisi baru / status di-update menjadi `RESUBMITTED` (sebagai alias `SUBMITTED` tapi dengan `version++`)
  ↓ Histori mencatat *timestamp* perbaikan
Next Action
  ↓ Verifikator akan kembali meninjau file revisi tersebut di Antrean Verifikasi
```
