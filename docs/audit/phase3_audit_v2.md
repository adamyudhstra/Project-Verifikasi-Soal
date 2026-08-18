# Deep Verification Audit V2 (Phase 3)

**Tanggal Audit:** 2026-08-18
**Auditor:** AI Agent (Read-Only Mode)
**Fokus:** Membuktikan penutupan temuan Audit V1 paska "remediasi".

---

## 1. Executive Summary

> [!CAUTION]
> **Verdict: BLOCKED**
> Tidak ada satu pun baris kode remediasi yang ditemukan. Seluruh struktur repositori, baik *backend* maupun *frontend*, identik dengan saat Audit V1 diterbitkan. Keseluruhan **22 temuan V1 berstatus NOT CLOSED**. Remediasi belum dijalankan atau tidak di-commit.

---

## 2. Tabel Penutupan Temuan

| ID | Temuan v1 | Status | Bukti kode | Bukti test | Catatan |
|---|---|---|---|---|---|
| C-01 | Versioning destruktif | **NOT CLOSED** | `SoalController.php:74-80` | N/A | Masih menggunakan `$existing->update()` |
| C-02 | `soals.catatan` ketimpa | **NOT CLOSED** | `SoalController.php:142-145` | N/A | `catatan` pada tabel `soals` masih ditimpa tanpa mempertahankan riwayat pada kolom soal |
| C-03 | State machine tidak ditegakkan | **NOT CLOSED** | `SoalController.php:121-154` | N/A | Method `verify()` sama sekali tidak memiliki pengecekan IF validasi *state* |
| C-04 | Re-upload diizinkan pada REJECTED/SUBMITTED | **NOT CLOSED** | `SoalController.php:68-72` | N/A | Method `store()` hanya menolak status `APPROVED` |
| C-05 | Otorisasi bolong pada show/download/beritaAcara/index | **NOT CLOSED** | `SoalController.php:98, 104, 157` | N/A | Tidak ada logika validasi role sama sekali di ketiga *endpoint* ini |
| C-06 | Unggah revisi tidak menghasilkan peristiwa histori | **NOT CLOSED** | `SoalController.php:74-82` | N/A | Mengunggah versi baru tidak diiringi pembuatan entitas `Verifikasi` |
| C-07 | Tidak ada SoalPolicy (architectural) | **NOT CLOSED** | `SoalController.php:48, 131` | N/A | Pengecekan authorization `if ($user->role !== 'SUPER_ADMIN')` dibiarkan *inline* di dalam controller |
| H-01 | `cascadeOnDelete` pada verifikasis | **NOT CLOSED** | `2026_08_17_183133_create_verifikasis_table.php:13` | N/A | Masih `cascadeOnDelete()` di skema migration |
| H-02 | Berkas pada disk `public` | **NOT CLOSED** | `SoalController.php:60` | N/A | Baris `$request->file('file')->store('soals', 'public')` masih sama persis |
| H-03 | Berkas lama harus dipertahankan | **NOT CLOSED** | `SoalController.php:74-80` | N/A | Karena C-01 belum dikerjakan, file lama secara fisik tersisa di disk tetapi tautannya ke DB dihancurkan |
| H-04 | Tidak ada route-level role guard | **NOT CLOSED** | `App.tsx:41-47` | N/A | Semua rute Phase 3 masih hanya ditutupi dengan `ProtectedRoute`, mengabaikan pengecekan peran (role) |
| H-05 | Response paginasi double-nested | **NOT CLOSED** | `SoalController.php:32-34` | N/A | Controller mengembalikan format `['data' => $query->paginate()]` yang menyebabkan `data.data` bersarang dua tingkat |
| H-06 | `KUIS` tidak ada di kontrak | **NOT CLOSED** | `SoalUpload.tsx:154` | N/A | `<option value="KUIS">Kuis</option>` masih bercokol di *frontend* |
| M-01 | `exam_category` tanpa enum | **NOT CLOSED** | `2026_08_17_183132_create_soals_table.php:16` | N/A | Masih `string` |
| M-02 | `status` tanpa enum | **NOT CLOSED** | `2026_08_17_183132_create_soals_table.php:19` | N/A | Masih `string` |
| M-03 | 409 tidak ditangani di VerifikasiDetail | **NOT CLOSED** | `VerifikasiDetail.tsx:83-89` | N/A | Tidak ada blok IF untuk error `409` |
| M-04 | Filter status hanya untuk VERIFIKATOR | **NOT CLOSED** | `SoalController.php:26-29` | N/A | Pengondisian `$request->has('status')` bersarang di bawah blok `else if ($user->role === 'VERIFIKATOR')` |
| M-05 | Hook `useSoals` tidak dibedakan per peran | **NOT CLOSED** | `useSoals.ts:4-9` | N/A | *Endpoint* dan *query keys* untuk koordinator dan verifikator tidak dipisahkan |
| L-01 | Pratinjau PDF tertanam | **NOT CLOSED** | `VerifikasiDetail.tsx:118-121` | N/A | Tidak ada *embedded PDF viewer*, hanya menggunakan tombol "Unduh Dokumen" |
| L-02 | Ekstensi `.pdf` di-hardcode | **NOT CLOSED** | `SoalDetail.tsx:27` | N/A | `link.setAttribute('download', '... .pdf')` |
| L-03 | Tombol template mengarah ke endpoint 404 | **NOT CLOSED** | `SoalController.php:118` | N/A | Endpoint mengembalikan status 404 "not implemented yet" |
| L-04 | Validasi inline, bukan Form Request | **NOT CLOSED** | `SoalController.php:39-44` | N/A | Menggunakan `$request->validate()` ketimbang sebuah *Form Request class* |

---

## 3. Temuan Baru

Tidak ada temuan baru (N-0X) akibat dari *regression* remediasi. Sebab, tidak ada remediasi yang diterapkan ke *codebase*. Struktur folder dan kelas-kelas sepenuhnya sama persis dengan saat Audit V1.

---

## 4. Regresi Phase 1 & 2

Hasil `php artisan test`:
`Tests:    30 passed (97 assertions)`

Tidak ada *test suite* Phase 1 dan Phase 2 yang *broken*. Namun hal ini dikarenakan absolut tidak ada kode yang mengalami modifikasi sejak pengujian sebelumnya.

---

## 5. Higienitas Git & Commit

**FATAL ERROR**
*Directory* `/Project-Verifikasi-Soal` di *working directory* saat ini **bukanlah repositori git aktif** (`fatal: not a git repository`). Oleh karena itu, evaluasi higienitas pesan *commit*, referensi *footer*, serta pengecekan *file* ganda tidak dapat dieksekusi secara teknis.

---

## 6. Ringkasan Cakupan Test

Hanya terdapat **3 Test Cases** di dalam berkas `SoalApiTest.php`:
1. `koordinator can upload soal`
2. `unauthorized user cannot upload`
3. `verifikator can verify soal`

*Missing Coverage Matrix* secara penuh masih sama persis dengan Audit V1, di mana kombinasi *state machine transition validation*, otorisasi *controller* tanpa `SoalPolicy`, serta akses *public* ke *storage disk* tidak diuji keamanannya.

---

## 7. Gate GO/NO-GO

> **SEMUA CEKLIST BERSTATUS FAIL KARENA BELUM ADA TINDAKAN REMEDIASI.**

- ❌ 1. Schema dipisah menjadi `soals` dan `soal_versions`
- ❌ 2. `cascadeOnDelete` dihapus dari model/relasi penting
- ❌ 3. Model `SoalPolicy` eksis dan digunakan di semua endpoint Phase 3
- ❌ 4. File disimpan di disk `private` atau aman dari URL publik
- ❌ 5. State machine divalidasi mutlak oleh backend
- ❌ 6. Otorisasi download dan akses view detail dicek ketat
- ❌ 7. Struktur JSON *response* `index()` tidak ganda (bukan `data.data`)
- ❌ 8. Paginasi dapat dibaca dan bekerja normal di React
- ❌ 9. Route frontend dilindungi oleh `RoleProtected` (atau ekuivalen)
- ❌ 10. `php artisan test` sukses komprehensif 
- ❌ 11. Tidak ada regresi atau penghapusan tes eksisting
