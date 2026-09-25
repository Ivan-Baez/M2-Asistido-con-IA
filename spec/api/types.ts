# Spec API Types (Source of Truth)

> **IMPORTANTE**: Este archivo es la única fuente de verdad para tipos compartidos entre frontend y backend.
> - Frontend: `import type { Movie, MovieCreateInput, ... } from '@/lib/api/types'`
> - Backend: JSDoc `@typedef` referenciando este archivo
> - Cualquier cambio aquí requiere actualizar ambos lados + `spec/api/contracts.md`

```typescript
// ============================================
// TIPOS BASE
// ============================================

export type MovieCategory = 'hito' | 'pelicula' | 'tecnologia' | 'personaje';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// PELÍCULAS / HITOS
// ============================================

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
  updatedAt: string; // ISO 8601
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

export interface MovieQueryParams {
  page?: number;
  limit?: number;
  category?: MovieCategory;
  year?: number;
  yearFrom?: number;
  yearTo?: number;
  search?: string;
  verified?: boolean;
  sort?: string; // ej: "-year", "title", "-createdAt"
}

// ============================================
// CHATBOT LUMIÈRE
// ============================================

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
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

// ============================================
// ASISTENTE ESPECIALIZADO (FUTURO)
// ============================================

export interface RecommendationPreferences {
  genres?: string[];
  decades?: number[];
  directors?: string[];
}

export interface RecommendRequest {
  preferences: RecommendationPreferences;
  excludeWatched?: string[];
}

export interface RecommendationItem {
  movieId: string;
  reason: string;
}

export interface RecommendResponse {
  recommendations: RecommendationItem[];
}

// ============================================
// ERRORES COMUNES
// ============================================

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MOVIE_NOT_FOUND: 'MOVIE_NOT_FOUND',
  EMPTY_MESSAGE: 'EMPTY_MESSAGE',
  OPENAI_ERROR: 'OPENAI_ERROR',
  OPENAI_TIMEOUT: 'OPENAI_TIMEOUT',
  OPENAI_RATE_LIMIT: 'OPENAI_RATE_LIMIT',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// ============================================
// HELPERS TYPE GUARDS
// ============================================

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.success === true && response.data !== undefined;
}

export function isApiError(response: ApiResponse<unknown>): response is ApiResponse<never> & { error: string; code: ErrorCode } {
  return response.success === false;
}
```

---

## Sincronización Backend (JSDoc)

En `back/src/services/moviesService.js` (y otros):

```javascript
/**
 * @typedef {Object} Movie
 * @property {string} _id
 * @property {string} title
 * @property {number} year
 * @property {string} director
 * @property {string} description
 * @property {'hito'|'pelicula'|'tecnologia'|'personaje'} category
 * @property {boolean} verified
 * @property {string} source
 * @property {string} createdAt - ISO 8601
 * @property {string} updatedAt - ISO 8601
 */

/**
 * @typedef {Object} MovieCreateInput
 * @property {string} title
 * @property {number} year
 * @property {string} director
 * @property {string} description
 * @property {'hito'|'pelicula'|'tecnologia'|'personaje'} category
 * @property {boolean} [verified=false]
 * @property {string} [source]
 */
```

---

## Validación Zod (Referencia)

```typescript
// front/lib/validation/schemas.ts
import { z } from 'zod';
import type { MovieCreateInput, MovieUpdateInput, MovieCategory } from '@/lib/api/types';

export const movieCategorySchema = z.enum(['hito', 'pelicula', 'tecnologia', 'personaje']);

export const movieBaseSchema = z.object({
  title: z.string().min(1).max(200),
  year: z.number().int().min(1888).max(new Date().getFullYear() + 5),
  director: z.string().min(1).max(150),
  description: z.string().min(1).max(5000),
  category: movieCategorySchema,
  verified: z.boolean().default(false),
  source: z.string().max(500).optional(),
});

export const movieCreateSchema = movieBaseSchema;
export const movieUpdateSchema = movieBaseSchema.partial();
export const movieParamsSchema = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/) });

// Type inference
export type MovieCreateInput = z.infer<typeof movieCreateSchema>;
export type MovieUpdateInput = z.infer<typeof movieUpdateSchema>;
```