# 10-GIT

Agent DILARANG melakukan operasi Git destructive atau repository history modification tanpa explicit user instruction.

Default:
- NO COMMIT
- NO PUSH
- NO RESET
- NO REBASE
- NO MERGE
- NO CLEAN
- NO REVERT

Agent boleh membaca:
- `git status`
- `git diff`
- `git log`
jika dibutuhkan untuk task.

Agent tidak boleh melakukan commit hanya karena task selesai. Read-only Git commands diperbolehkan jika diperlukan.

## DESTRUCTIVE ACTION
Agent tidak boleh:
- delete files,
- drop tables,
- remove migrations,
- overwrite important docs,
- delete legacy evidence,
tanpa explicit user instruction. "Cleanup" bukan izin untuk delete.
