# AOE Authorization Model

Permissões conceituais:

- `PROFESSIONAL`: solicita decisão, consulta decisão autorizada, consulta trace autorizado e revisa.
- `ADMIN`: permissões ampliadas.
- `SYSTEM`: processamento interno, sem aprovação humana.
- `STUDENT_READ_ONLY`: leitura pública autorizada, sem trace e sem revisão.

Quando `organizationId` existe, a organização participa da autorização.
