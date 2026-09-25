# Roadmap

## Estado Actual: Núcleo Implementado (v0.1)

### ✅ HECHO - Funcionalidades Core
1. **001 - Catálogo de Películas/Hitos** - CRUD completo via API + UI
2. **002 - Timeline Visual** - FilmStrip interactivo con scroll horizontal
3. **003 - Asistente Lumière** - Chatbot IA conversacional (OpenAI + system prompt cinematográfico)
4. **004 - Página "Mientras tanto en la realidad"** - Contexto histórico paralelos
5. **005 - Página Sobre el Proyecto** - Documentación del proyecto
6. **006 - Crear Nueva Película** - Formulario validado conectado a backend

---

## PRÓXIMAS FASES (orden de prioridad)

### Fase 1: Pulido y Calidad (v0.2)
- **007 - Validación y Sanitización** - Zod schemas tanto en front como back
- **008 - Manejo de Errores Unificado** - Error boundaries + toast notifications
- **009 - Loading States** - Skeletons en FilmStrip y Chatbot
- **010 - Tests Unitarios** - Jest para servicios back + React Testing Library front

kluy

### Fase 3: IA Avanzada (v0.4)
- **015 - RAG Básico** - Embeddings de descripciones para búsqueda semántica
- **016 - Modo "Trivia/Quiz"** - Lumière genera preguntas sobre hitos
- **017 - Recomendaciones Personalizadas** - Basado en historial de chat
- **018 - Voz (TTS/STT)** - Web Speech API para charlar con Lumière

### Fase 4: Seguridad y Modo Demo (v0.5)
- **019 - Modo Demo para Reclutadores** - Redirigir operaciones de creación/eliminación a la colección `movies_demo` cuando se use `mode=demo`.
- **020 - Verificación de Integridad** - Middleware que asegure que la colección `movies` nunca se modifica en modo demo.
- **021 - Logs de Auditoría** - Registrar en consola o archivo cada operación en modo demo para transparencia.
- **022 - Documentación de Uso** - Guía clara para reclutadores sobre cómo activar y usar el modo demo.

---

## Metodología para Nuevas Features

Cada feature nueva se crea en:
```
spec/features/NNN-nombre-corto/
├── spec.md      # Qué se construye, criterios de aceptación
├── plan.md      # Cómo se implementa (archivo, funciones, endpoints)
└── tasks.md     # Checklist de tareas atómicas (para sub-agentes)
```

**Regla**: No tocar código hasta que los 3 documentos estén aprobados.