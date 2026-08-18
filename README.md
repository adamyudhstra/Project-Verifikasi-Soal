# VERIF SOAL

Sistem Informasi Verifikasi Soal untuk manajemen proses akademik, autentikasi berbasis OBE, dan unggah soal terverifikasi. 

Repositori ini mematuhi tata kelola sistem agen AI dan menggunakan arsitektur **Monorepo Modular Monolith**.

## Repository Structure

```text
/
├── apps/
│   ├── web/               (Frontend SPA - React 19)
│   └── api/               (Backend REST - Laravel 12)
├── docs/                  (System requirements & knowledge)
├── rules/                 (AI Agent governance)
├── scripts/               (Dev & Maintenance scripts)
└── .agents/               (Workspace rules parser)
```

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS 4, React Router 7.
- **Backend**: Laravel 12, PHP 8.2, Sanctum.
- **Database**: PostgreSQL (Development, Testing, Staging, Production).

## Documentation & Rules
Seluruh kebutuhan sistem dan aturan bisnis didokumentasikan di dalam direktori `/docs`. 
Tata kelola instruksi dan batasan untuk AI agent ditetapkan secara mutlak di dalam direktori `/rules`. 

*Note: Jangan menduplikasi spesifikasi fungsional dari `/docs` ke dalam file ini.*
