# Contratos API (v1)

## Base URL
```
Desarrollo: http://localhost:3001/api/v1
Producción: https://api.tudominio.com/api/v1
```

## Formato de Respuesta Estándar
```typescript
// Éxito
{
  "success": true,
  "data": T
}

// Error
{
  "success": false,
  "error": "Mensaje legible para usuario",
  "code": "ERROR_CODE",        // Opcional: para frontend
  "details": {}                // Opcional: validation errors
}
```

## Códigos HTTP
- `200` - OK
- `201` - Created
- `400` - Bad Request (validación)
- `404` - Not Found
- `500` - Internal Server Error

---

## ENDPOINTS

### 🎬 Películas / Hitos (`/movies`)

#### GET /movies
**Listar todas las películas con filtros opcionales**

**Query Params:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `page` | number | 1 | Página (futuro) |
| `limit` | number | 50 | Items por página |
| `category` | string | - | Filtro: "hito" \| "pelicula" \| "tecnologia" \| "personaje" |
| `year` | number | - | Año exacto |
| `yearFrom` | number | - | Año desde |
| `yearTo` | number | - | Año hasta |
| `search` | string | - | Búsqueda texto (title, director, description) |
| `verified` | boolean | - | Solo verificadas |
| `sort` | string | "-year" | Campo: year, title, createdAt. Prefijo - = desc |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "66a1b2c3d4e5f6789012345",
      "title": "El nacimiento de una nación",
      "year": 1915,
      "director": "D.W. Griffith",
      "description": "Primera película largometraje...",
      "category": "hito",
      "verified": true,
      "source": "Wikipedia / Biblioteca del Congreso",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET /movies/:id
**Obtener una película por ID**

**Response 200:** Igual que item del array anterior
**Response 404:** `{ "success": false, "error": "Película no encontrada", "code": "MOVIE_NOT_FOUND" }`

#### POST /movies
**Crear nueva película**

**Body:**
```json
{
  "title": "string (required, max 200)",
  "year": "number (required, 1888-2030)",
  "director": "string (required, max 150)",
  "description": "string (required, max 5000)",
  "category": "string (required, enum: ['hito','pelicula','tecnologia','personaje'])",
  "verified": "boolean (default: false)",
  "source": "string (max 500)"
}
```

**Response 201:** Item creado con `_id`, `createdAt`, `updatedAt`
**Response 400:** Validation errors en `details`

#### PUT /movies/:id
**Actualizar película completa**

**Body:** Mismo que POST (todos required)
**Response 200:** Item actualizado

#### PATCH /movies/:id
**Actualización parcial**

**Body:** Cualquier campo opcional
**Response 200:** Item actualizado

#### DELETE /movies/:id
**Eliminar película**

**Response 200:** `{ "success": true, "data": { "deleted": true } }`
**Response 404:** Not found

---

### 🤖 Chatbot Lumière (`/chatbot`)

#### POST /chatbot/message
**Enviar mensaje al asistente**

**Body:**
```json
{
  "message": "string (required, max 2000)",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ] // Opcional, máx 10 pares
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "response": "Respuesta de Lumière...",
    "tokensUsed": 156,
    "model": "gpt-4o-mini"
  }
}
```

**Response 400:** `{ "success": false, "error": "Mensaje vacío", "code": "EMPTY_MESSAGE" }`
**Response 500:** Error de OpenAI (timeout, rate limit, etc.)

---

### 🎭 Asistente Especializado (`/assistant`)

#### POST /assistant/recommend
**Recomendación personalizada (futuro)**

**Body:**
```json
{
  "preferences": {
    "genres": ["drama", "ciencia-ficcion"],
    "decades": [1970, 1980],
    "directors": ["Kubrick", "Tarkovsky"]
  },
  "excludeWatched": ["movieId1", "movieId2"]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      { "movieId": "...", "reason": "Porque te gustó..." }
    ]
  }
}
```

---

## TIPOS COMPARTIDOS (TypeScript)

```typescript
// spec/api/types.ts - Fuente de verdad para front y back

export type MovieCategory = 'hito' | 'pelicula' | 'tecnologia' | 'personaje';

export interface Movie {
  _id: string;
  title: string;
  year: number;
  director: string;
  description: string;
  category: MovieCategory;
  verified: boolean;
  source: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface MovieCreateInput {
  title: string;
  year: number;
  director: string;
  description: string;
  category: MovieCategory;
  verified?: boolean;
  source?: string;
}

export interface MovieUpdateInput extends Partial<MovieCreateInput> {}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  tokensUsed: number;
  model: string;
}
```

---

## VALIDACIONES BACKEND (Zod-equivalent en validateMovie.js)

```javascript
// Reglas actuales en middlewares/validateMovie.js
const rules = {
  title: { required: true, max: 200, type: 'string' },
  year: { required: true, type: 'number', min: 1888, max: new Date().getFullYear() + 5 },
  director: { required: true, max: 150, type: 'string' },
  description: { required: true, max: 5000, type: 'string' },
  category: { required: true, enum: ['hito', 'pelicula', 'tecnologia', 'personaje'] },
  verified: { type: 'boolean', default: false },
  source: { max: 500, type: 'string' }
};
```

---

## CORS
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: false
```

---

## VERSIONADO
- `v1` actual - Estable
- Cambios breaking → `v2` en nueva ruta
- Deprecación: 3 meses notice en headers `Deprecation: true` + `Link: <v2>; rel="successor-version"`