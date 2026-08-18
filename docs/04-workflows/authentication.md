# Authentication Workflow

## 1. Login Workflow

**Actor**: Super Admin, Koordinator, Verifikator
**Precondition**: Memiliki akun aktif di tabel `users`.

```text
Actor
  ↓ Memasukkan Kredensial (Email & Password)
Action
  ↓ Klik "Login"
System Validation
  ↓ Verifikasi Hash Password & Status Akun via Laravel Sanctum
State Change
  ↓ Session/Token Diterbitkan, Session Role dikukuhkan
Next Action
  ↓ Redirect ke Dashboard yang relevan dengan Rolenya
```

## 2. Session/Role Checking (Middlewares)
Di setiap request halaman atau API:
1. Sistem memastikan token Sanctum valid.
2. Otorisasi Role memvalidasi:
   - Jika endpoint Super Admin diakses oleh Verifikator -> HTTP 403 Forbidden.
   - Jika endpoint Koordinator diakses oleh Verifikator -> HTTP 403 Forbidden.
   - Hak istimewa *ownership* (Berdasarkan parameter spesifik misalnya ID Soal).
