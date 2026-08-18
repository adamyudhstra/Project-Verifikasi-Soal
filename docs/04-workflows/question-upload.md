# Question Upload Workflow

## 1. Unggah Soal Awal (Baru)

**Actor**: Koordinator MK
**Precondition**: Dosen telah diberikan penugasan aktif (Assignment) pada sebuah MK di Semester Berjalan. Periode sedang berada pada fase Unggah (Belum melewati *deadline*).

```text
Koordinator MK
  ↓ Membuka menu "Unggah Soal"
Action
  ↓ Memilih Mata Kuliah yang menjadi haknya (Dropdown terfilter)
  ↓ Memilih Periode (otomatis menyesuaikan periode aktif: UTS/UAS)
  ↓ Mengunggah File Ujian berformat PDF
System Validation
  ↓ Pastikan PDF < ukuran batas max
  ↓ Pastikan MK adalah tanggung jawab dari ID session
State Change
  ↓ Soal tercipta di database, Status = `SUBMITTED`, Versi = `1`
Next Action
  ↓ Menunggu proses peninjauan dari Verifikator
```
