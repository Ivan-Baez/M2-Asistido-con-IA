# Arquitectura del Sistema

## Visión General

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO                                   │
│                  (Navegador - Puerto 3000)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS/HTTP
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Server Comp │  │ Client Comp │  │   API Layer (Axios)     │  │
│  │  (RSC)      │  │  (Interact) │  │   front/lib/api.ts      │  │
│  └─────────────┘  └─────────────┘  └───────────┬─────────────┘  │
└─────────────────────────────────────────────────│────────────────┘
                                                  │ REST/JSON
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express 5)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Routes    │  │ Controllers │  │      Services           │  │
│  │ (Endpoints) │──▶│  (HTTP)     │──▶│  (Business Logic + IA) │  │
│  └─────────────┘  └─────────────┘  └───────────┬─────────────┘  │
│                                                │                │
│  ┌─────────────┐  ┌─────────────┐              │                │
│  │  Models     │  │ Middlewares │◀─────────────┘                │
│  │ (Mongoose)  │  │ (Validation)│                               │
│  └─────────────┘  └─────────────┘                               │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB (Puerto 27017)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Collection: movies                                     │   │
│  │  Indexes: { title: text, year: 1, category: 1 }        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos Principales

### 1. Carga Inicial (Home / FilmStrip)
```
Usuario → GET / → Next.js Server Component
  → fetch('/api/movies') → Express GET /api/v1/movies
  → moviesService.getAll() → Mongoose Movie.find()
  → JSON → Server Component render → HTML → Browser
```

### 2. Chat con Lumière (Asistente IA)
```
Usuario escribe → Client Component (Chatbot)
  → POST /api/v1/chatbot/message { message, history }
  → chatbotController → chatbotService.processMessage()
  → assistantService.callOpenAI(systemPrompt + history + message)
  → OpenAI API → Respuesta streaming
  → JSON → Client Component actualiza UI
```

### 3. Crear Película
```
Usuario → /newMovie (Client Component Form)
  → POST /api/v1/movies { title, year, director, ... }
  → moviesController.create → validateMovie middleware
  → moviesService.create → Movie.create()
  → 201 Created → Toast success → Redirect /home
```

## Capas de Responsabilidad

| Capa | Archivos | Responsabilidad | No Hace |
|------|----------|-----------------|---------|
| **Routes** | `src/routes/*.js` | Definir endpoints, método, path | Lógica de negocio |
| **Controllers** | `src/controllers/*.js` | Parse req, validar basics, llamar service, format res | DB queries directas |
| **Services** | `src/services/*.js` | Lógica de negocio, IA, transacciones, validaciones complejas | HTTP handling |
| **Models** | `src/models/*.js` | Schema Mongoose, statics, methods, virtuals | Business logic |
| **Middlewares** | `src/middlewares/*.js` | Validación request, auth, error handling | Business logic |

## Patrones Implementados

### Service Layer Pattern
```javascript
// moviesService.js
async function create(data) {
  const movie = new Movie(data);
  await movie.save();
  return movie;
}
```

### Dependency Injection (Manual)
```javascript
// server.js
const moviesRouter = require('./routes/moviesRouter')(moviesService);
```

### Environment Configuration
```javascript
// conDb.js
module.exports = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};
```

## Puntos de Extensión Futura

1. **Auth Middleware** → `src/middlewares/auth.js` (listo para insertar en routes)
2. **Rate Limiting** → Express-rate-limit en `server.js`
3. **Caché Redis** → En `moviesService.getAll()` antes de Mongoose
4. **WebSockets** → Socket.io en nuevo `src/services/realtimeService.js`
5. **Vector Search** → Nueva collection `movie_embeddings` + service dedicado