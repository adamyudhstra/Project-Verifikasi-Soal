# 11-CODING STANDARDS & ARCHITECTURE GOVERNANCE

File ini merupakan **KONTRAK ABSOLUT** yang mengatur standar penulisan kode, penempatan file, arah dependensi, dan batasan arsitektural di dalam aplikasi (*apps/*) repositori VERIF SOAL. 

Agen AI **WAJIB** menjadikan dokumen ini sebagai patokan tertinggi dalam membuat atau menyunting *source code*. Agen **DILARANG** melakukan improvisasi arsitektural (*overengineering*), refaktorisasi massal, atau memaksakan *pattern* tanpa instruksi.

---

## 1. STRUKTUR FRONTEND (`apps/web`)

Aplikasi Frontend (React 19 + TypeScript + Vite + TailwindCSS 4) berpedoman pada pola **Feature-Oriented Architecture**. Struktur utamanya:
- `src/features/`: Direktori fitur berbasis domain bisnis.
- `src/components/`: Komponen UI global (non-domain spesifik, contoh: `Button`, `Table`).
- `src/layouts/`: Kerangka dasar tata letak (*Dashboard*, *Auth*).
- `src/routes/`: Definisi jalur navigasi React Router.
- `src/services/`: Modul klien API terpusat.
- `src/hooks/`: Hooks kustom global.
- `src/lib/`: Fungsi pembantu spesifik pihak ketiga (*libraries*, utilitas absolut). Dilarang menjadikan ini sebagai *dumping ground*.
- `src/types/`: Definisi *TypeScript interface* / *type* global.
- `src/assets/`: Media statis.

### Aturan Batas Fitur (*Feature Boundaries*)
Domain bisnis direpresentasikan dalam folder fitur (misal: `features/academic/`, `features/verification/`). Sebuah fitur hanya boleh memuat komponen/skrip yang menjadi otoritasnya.

### Arah Ketergantungan (*Dependency Direction*)
**Routes → Features → Shared Components / Libraries**
Komponen dalam satu fitur tidak boleh memiliki *circular dependency* ke fitur lain.

---

## 2. STRUKTUR BACKEND (`apps/api`)

Aplikasi Backend (Laravel 12 + PHP 8.2 + Sanctum) berpedoman pada **Modular Monolith**. 
Struktur wajib:
- `app/Http/Controllers/`: Mengelola transport HTTP. Tidak boleh berisi *business logic* kompleks.
- `app/Http/Requests/`: Validasi *form request*.
- `app/Models/`: Entitas berbasis *Eloquent*.
- `app/Services/`: Otak *business logic* dan orkestrasi aplikasi. 

### Arah Ketergantungan (*Dependency Direction*)
**Transport (Controllers) → Business Logic (Services) → Persistence (Models)**
- *Domain/Business layer* tidak boleh bergantung pada *HTTP Presentation*.
- Jangan memaksakan *Clean Architecture* penuh (seperti *Repositories* atau *UseCases* eksplisit) kecuali telah dibakukan sebelumnya di *codebase* berjalan.

---

## 3. ATURAN PENAMAAN (*NAMING CONVENTION*)

### Backend
- **PHP Classes/Interfaces/Traits**: `PascalCase` (Contoh: `QuestionService`, `VerificationController`).
- **Methods/Functions**: `camelCase`.
- **Namespace**: Sesuai standar PSR-4 Laravel (`PascalCase`).

### Frontend
- **React Components**: `PascalCase` (Contoh: `QuestionTable.tsx`).
- **Hooks & Utility Functions**: `camelCase` (Contoh: `useQuestions.ts`).
- **Feature Directories**: `kebab-case` (Contoh: `berita-acara/`).
- **Routes/URLs**: `kebab-case`.

### Database & API
- **Tables & Columns**: `snake_case` (Contoh: `course_clos`, `created_at`).
- **Primary Key**: `id`.
- **Foreign Key**: `<entity>_id` (Contoh: `course_id`).
- **API Endpoints**: Plural & `kebab-case` pada *Base URL* `/api/v1/` (Contoh: `/api/v1/soal-kategori`). Dilarang menggunakan pola kata kerja (seperti `/getQuestions`).

---

## 4. ATURAN INTEGRITAS LAINNYA

1. **NO RANDOM UTILITIES**: Pembuatan folder seperti `utils/`, `helpers/`, `misc/`, atau `common/` sebagai *dumping ground* **DILARANG KERAS**. Fungsi pembantu harus memiliki *responsibility*, *consumer*, dan *boundary* yang spesifik.
2. **DATABASE ABSOLUT**: Sistem menggunakan **PostgreSQL** pada segala tingkat (Dev/Test/Staging/Prod). Dilarang menyuntikkan konfigurasi SQLite.
3. **NO CIRCULAR DEPENDENCY**: Pelanggaran dependensi melingkar wajib dilaporkan sebagai *REPORT*, dan tidak boleh langsung di-*refactor* secara diam-diam.
4. **API CONTRACT GOVERNANCE**: Penambahan dan pengurangan *endpoint* atau pengubahan format balasan (JSON) wajib diselaraskan dengan `/docs`. Agen tidak boleh menciptakan kontrak API sendiri.
