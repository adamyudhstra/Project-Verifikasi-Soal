# VERIF SOAL - Agent Governance Rules

Folder ini adalah **governance layer** untuk seluruh AI agent yang bekerja di repository VERIF SOAL.

Tujuannya BUKAN mendokumentasikan requirement aplikasi (requirement tetap di `docs/`). Folder ini berisi aturan yang mengontrol bagaimana AI agent WAJIB bekerja ketika membaca, menganalisis, mendokumentasikan, mendesain, atau mengubah project.

## Rule Priority

Jika terdapat conflict antar rules, ikuti hierarki berikut (nomor terkecil = prioritas tertinggi):

1. `rules/00-core.md`
2. `rules/01-agent.md`
3. `rules/02-requirements.md`
4. `rules/03-architecture.md`
5. `rules/04-database.md`
6. `rules/05-api.md`
7. `rules/06-ui.md`
8. `rules/07-qa.md`
9. `rules/08-security.md`
10. `rules/09-documentation.md`
11. `rules/10-git.md`

Jangan membuat rule yang lebih rendah membatalkan rule yang lebih tinggi.

## Source of Truth Hierarchy

Gunakan hierarchy berikut ketika menghadapi konflik:
1. Explicit user instruction pada conversation aktif
2. Final approved decision dari user
3. Latest approved meeting/notulen
4. Official Telkom University academic/OBE source
5. Final documentation di `/docs`
6. Final ERD/schema
7. Actual implementation
8. Legacy/archive documentation
9. Agent inference (Prioritas PALING RENDAH, tidak boleh diperlakukan sebagai requirement)
