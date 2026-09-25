# Misión del Proyecto

## Qué construimos
Una aplicación web full-stack para gestión y descubrimiento de películas/hitos cinematográficos, con asistente IA conversacional (Lumière) que guía al usuario en la exploración de la historia del cine.

## Para quién
- Entusiastas del cine que quieren explorar hitos históricos
- Estudiantes de cine/audiovisuales
- Usuarios casuales que buscan recomendaciones conversacionales

## Principios
1. **Experiencia conversacional first** - La IA (Lumière) es la interfaz principal, no un añadido
2. **Backend desacoplado** - API REST limpia que permite múltiples frontends
3. **Datos verificados** - Cada hito tiene fuente y validación
4. **Sin build complejo en frontend** - Next.js App Router con server components
5. **Persistencia real** - MongoDB para datos, no localStorage

## Qué no es
- No es un clon de IMDb/TMDB
- No es solo un catálogo estático
- No requiere autenticación de usuario (fase actual)
- No usa bases de datos vectoriales complejas (usa OpenAI directo)