# 04-DATABASE

Database harus konsisten dengan:
- final requirements,
- ERD,
- migrations,
- models,
- data dictionary.

## DATABASE ENGINE (ABSOLUTE)
DATABASE ENGINE FINAL: **POSTGRESQL**. 
PostgreSQL digunakan untuk seluruh siklus (*Development, Testing, Staging, Production*). 
Jika dokumentasi *legacy* menyebut SQLite, maka itu dinyatakan **LEGACY / OUTDATED**. 
Jangan mengubah lingkungan *testing* atau *development* menjadi SQLite karena alasan kemudahan; ini dikunci untuk menjaga konsistensi perilaku pangkalan data.

Tidak boleh membuat:
- table tanpa requirement,
- relationship tanpa business reason,
- column tanpa purpose,
- duplicate relationship,
- silent fallback.

## Historical Data
Jika requirement membutuhkan history: jangan overwrite historical record. 
Namun jangan menambahkan history mechanism tanpa requirement/evidence.

## Naming
Ikuti convention repository yang sudah established. Jangan mengubah naming convention hanya karena preference agent.
