# Límites Duros (Hard Constraints)

## Técnicos No Negociables

### Backend
- **MongoDB obligatorio** - No PostgreSQL, no SQLite, no Firebase
- **Express 5** - No Fastify, no Hono, no NestJS
- **Mongoose ODM** - No driver nativo, no Prisma
- **Puerto 3001** - Hardcoded en index.js, configurable solo via PORT env
- **Una sola conexión DB** - Singleton en `conDb.js`

### Frontend
- **Next.js 14 App Router** - No Pages Router, no Vite, no CRA
- **React 18** - No 19, no Preact
- **TypeScript strict: true** - No `any` en código nuevo
- **Puerto 3000** - next dev default
- **Axios only** - No fetch nativo, no ky, no swr/tanstack query (por ahora)

### IA
- **OpenAI SDK oficial** - No LangChain, no Vercel AI SDK, no ollama
- **Modelo configurable via env** - Default: gpt-4o-mini
- **System prompt en `assistantService.js`** - No en base de datos, no en frontend
- **Temperatura ≤ 0.7** - Para consistencia factual

## Arquitectura

### Comunicación Front↔Back
- **Solo REST/JSON** - No GraphQL, no gRPC, no WebSockets (fase actual)
- **CORS solo origen 3000** - Configurado en `server.js`
- **Sin autenticación** - Fase actual es pública

### Estructura de Carpetas (Inmutable)
```
back/
├── index.js              # Entry point único
├── src/
│   ├── config/           # Solo DB y env
│   ├── controllers/      # Solo HTTP (req/res)
│   ├── routes/           # Solo definen endpoints
│   ├── services/         # Lógica de negocio + IA
│   ├── models/           # Solo Mongoose schemas
│   └── middlewares/      # Solo validación/auth
└── package.json

front/
├── app/                  # App Router only
│   ├── components/       # Client Components
│   ├── [route]/page.tsx  # Server Components por defecto
│   └── globals.css
├── scripts/              # Legacy (no tocar, migrar a app/)
├── public/               # Static assets
└── package.json
```

## Prohibido Explícitamente
- ❌ `localStorage` / `sessionStorage` para datos de películas
- ❌ Llamadas directas a OpenAI desde frontend
- ❌ `dangerouslySetInnerHTML` sin sanitizar
- ❌ `console.log` en producción (usar logger)
- ❌ Dependencias nuevas sin documentar en `tech-stack.md`
- ❌ Cambiar puertos sin actualizar CORS y docs
- ❌ Commits directos a main sin PR (cuando haya repo remoto)

## Límites de Recursos
- **Tokens OpenAI/request**: ≤ 4000 (prompt + completion)
- **Timeout API**: 30s (Express default)
- **Tamaño payload**: 1MB (Express default)
- **Conexiones Mongo**: Pool 10 (Mongoose default)