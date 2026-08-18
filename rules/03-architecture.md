# 03-ARCHITECTURE

Architecture decision hanya boleh berasal dari:
- user decision,
- approved documentation,
- explicit technical decision.

Agent **tidak boleh memilih**:
- framework,
- database,
- architecture pattern,
- infrastructure,
- service architecture,
- authentication architecture,
berdasarkan preference pribadi.

Jika user meminta rekomendasi architecture, barulah agent boleh melakukan recommendation analysis. 
Jika tidak diminta: 
**FACT → GAP → OPEN DECISION.**

Agent DILARANG memberikan "saran arsitektur" yang tidak dipicu (unsolicited) oleh prompt user.

## Repository Structure & Tech Stack Boundary
Struktur resmi repositori ini menggunakan **Monorepo Modular Monolith**.
- **Frontend**: Berada di `apps/web/` menggunakan pendekatan *Feature-oriented structure* (React 19, Vite, TailwindCSS 4, React Router 7).
- **Backend**: Berada di `apps/api/` menggunakan *Modular Monolith* (Laravel 12, PHP 8.2).
- **Database**: PostgreSQL sentral, berbasis `apps/api/database/`.
- **Packages**: Penggunaan shared `packages/` dilarang untuk saat ini karena tidak ada *multiple consumers*.

## No Architecture Creep
Agent **TIDAK BOLEH** secara otomatis menambahkan instruksi atau file untuk:
- Microservices, API Gateway
- Message Broker (Kafka, RabbitMQ, Event Bus)
- Redis, Docker Swarm, Kubernetes, Service Mesh
- CQRS, Event Sourcing, DDD Framework, Workspace tooling
kecuali ada EXPLICIT USER INSTRUCTION. Alasan "best practice", "modern", atau "scalable" dilarang dipakai sebagai pembenaran.

## Naming Convention
- **Classes/Models**: `PascalCase`
- **Frontend Files**: `PascalCase` (Components), `camelCase` (Hooks/Utils)
- **Database Tables/Columns**: `snake_case`
- **Directories**: `kebab-case` (Frontend & Root), `PascalCase` (Backend Namespace)
- **API Endpoints**: Plural `kebab-case`

## Dependency Direction
- **Backend**: `Controllers (Transport)` → `Services (Business)` → `Models/Repositories (Persistence)`. Domain tidak boleh bergantung pada Transport.
- **Frontend**: `Pages` → `Features/Widgets` → `Shared UI Components`.
- **Forbidden Coupling**: Tidak boleh ada *circular dependency*.

## Configuration Convention
Configuration harus dipusatkan. Jangan menyebarkan *magic values*, URLs, timeouts, atau *environment-specific settings* ke *random source files*. Jangan membuat abstraksi konfigurasi yang tidak dibutuhkan.
