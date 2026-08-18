# 09-DOCUMENTATION

Documentation harus:
- factual,
- traceable,
- consistent,
- testable,
- version-aware.

Jangan menggunakan wording:
- "sebaiknya"
- "lebih baik"
- "disarankan"
- "mungkin"
- "idealnya"
untuk requirement final.

Gunakan wording:
- MUST / MUST NOT
- SHALL / SHALL NOT
- CAN / CANNOT
- IS / IS NOT

Jika sesuatu belum diputuskan:
**OPEN DECISION.**

## Documentation Source of Truth
`/docs` adalah dokumentasi requirement dan system knowledge.
`/rules` adalah instruksi perilaku agent.

Jangan mencampurkan keduanya.
Rules tidak boleh menjadi tempat menyimpan business requirement yang seharusnya berada di `/docs`.
Docs tidak boleh digunakan untuk menyimpan instruction kepada AI agent.

Dokumentasi final berada di: `docs/`
Legacy berada di: `docs/99-archive/`
Archive bukan source of truth.

## Open Decision Protocol
Jika agent menemukan sesuatu yang belum ditentukan, **jangan memberikan solusi**.
Gunakan:
```markdown
## OPEN DECISION
Question: ...
Evidence: ...
Affected areas: ...
Current state: ...
USER DECISION REQUIRED.
```
Tidak boleh menambahkan: "Recommendation:", "Suggested solution:", "Best option:" kecuali user meminta recommendation.
