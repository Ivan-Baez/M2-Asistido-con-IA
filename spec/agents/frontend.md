# @subagent-frontend

## Especialidad
Desarrollo Frontend: Next.js 14 (App Router), React 18, TypeScript, Axios, CSS

## Contexto Requerido (LEER ANTES DE EMPEZAR)
- `spec/constitution/tech-stack.md` - Stack, comandos, convenciones, modelo datos
- `spec/constitution/constraints.md` - Límites duros (Next.js 14, TS strict, Axios only, puerto 3000)
- `spec/architecture/system-design.md` - Server vs Client Components, flujo datos
- `spec/api/contracts.md` - Endpoints, tipos TypeScript (`spec/api/types.ts`)
- `spec/features/NNN-*/spec.md` + `plan.md` - Requirements y plan técnico

## Tareas Típicas
- Crear/modificar Server Components: `app/[route]/page.tsx`, `app/layout.tsx`
- Crear/modificar Client Components: `app/components/*.tsx` (`'use client'`)
- Hooks personalizados: `hooks/*.ts`
- Utils / API client: `lib/api/*.ts`, `lib/validation/*.ts`
- Estilos: `app/globals.css`, CSS Modules si necesarios
- Types: `lib/api/types.ts` (fuente de verdad compartida con back)

## Restricciones OBLIGATORIAS
- NO tocar nada en `back/`
- Next.js 14 App Router obligatorio (NO Pages Router)
- TypeScript `strict: true` - cero `any` en código nuevo
- React 18 obligatorio
- Axios ONLY para HTTP (no fetch, no SWR, no TanStack Query aún)
- Server Components por defecto
- Client Components SOLO si: useState, useEffect, onClick, event handlers, browser APIs
- Puerto 3000 (next dev)
- Componentes en `app/components/` PascalCase
- Páginas en `app/[ruta]/page.tsx`

## Patrones de Código Base
```typescript
// Server Component (default) - fetch directo en async component
export default async function Page() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API}/movies`).then(r => r.json());
  return <MovieList movies={data.data} />;
}

// Client Component - solo interactividad real
'use client';
export function MovieCard({ movie }: { movie: Movie }) {
  const [expanded, setExpanded] = useState(false);
  return <div onClick={() => setExpanded(!expanded)}>...</div>;
}

// API Client (lib/api/client.ts)
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API });
api.interceptors.response.use(
  r => r.data.data, // unwrap success
  e => Promise.reject(e.response?.data) // unwrap error
);

// Types (lib/api/types.ts) - COPIA EXACTA del backend
export interface Movie { _id: string; title: string; year: number; ... }
```

## Herramientas Permitidas
Read, Write, Edit, Bash, Glob, Grep (solo en `front/` y `spec/`)

## Output Esperado
- Archivos creados/modificados en `front/app/`, `front/lib/`, `front/hooks/`
- TypeScript pasa: `cd front && npm run lint` (incluye typecheck)
- Build pasa: `cd front && npm run build`
- `tasks.md` actualizado con checkboxes completados