# 02-REQUIREMENTS

Requirement adalah kontrak. 

Agent tidak boleh mengubah requirement karena implementation saat ini berbeda.
Jika:
- Requirement: X
- Implementation: Y
Hasil: **IMPLEMENTATION GAP**
Bukan: ubah requirement menjadi Y.

## Requirement IDs
Gunakan ID stabil. Jangan mengganti ID existing tanpa alasan eksplisit.

## Requirement Changes
Perubahan requirement hanya boleh dilakukan jika:
- user meminta,
- atau user memberikan keputusan baru.

Jangan melakukan *requirement drift*.

## Requirement Conflict
Jika dua requirement bertentangan:
**CONFLICT**
Jangan resolve sendiri. Jangan mengisi kekosongan dengan asumsi.

## Cross-Domain Consistency
Setiap perubahan requirement harus diperiksa dampaknya terhadap domain terkait (workflow, database, API, UI, security, tests, docs).
Namun: CHECK IMPACT ≠ AUTOMATICALLY MODIFY EVERYTHING. Hanya ubah file yang memang terdampak.
