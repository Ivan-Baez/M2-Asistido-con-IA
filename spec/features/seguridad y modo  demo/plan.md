# Plan de Implementación

1. Crear modelo `movies_demo` en `src/models/`.
2. Modificar `moviesController` y `moviesService` para detectar `mode=demo`.
3. Redirigir operaciones CRUD a `movies_demo` cuando corresponda.
4. Implementar middleware `verifyDemoMode` en `src/middlewares/`.
5. Agregar logs de auditoría en consola/archivo.
6. Documentar uso en README y roadmap.
