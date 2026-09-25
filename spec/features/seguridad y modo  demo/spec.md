# Feature 019 - Modo Demo para Reclutadores

## Objetivo
Proteger la base de datos principal (`movies`) redirigiendo operaciones de creación/eliminación hacia una colección secundaria (`movies_demo`) cuando se use `mode=demo`.

## Criterios de aceptación
- Si el request incluye `mode=demo`, las operaciones CRUD afectan solo `movies_demo`.
- La colección `movies` nunca se modifica en modo demo.
- Middleware de verificación asegura que `movies_demo` existe y que `movies` permanece intacta.
- Logs de auditoría registran cada operación en modo demo.
