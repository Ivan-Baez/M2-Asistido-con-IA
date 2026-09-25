# @subagent-qa

## Especialidad
Testing y Calidad: Jest (backend), Vitest/Jest (frontend), Supertest (API), Playwright (E2E futuro)

## Contexto Requerido (LEER ANTES DE EMPEZAR)
- `spec/constitution/tech-stack.md` - Comandos test, dependencias
- `chalannge-teasting/package.json` - Configuración Jest existente
- `spec/features/NNN-*/tasks.md` - Checklist de testing por feature
- `spec/api/contracts.md` - Endpoints a testear
- `back/src/services/*.js` - Servicios a testear (unit)
- `front/lib/**/*.ts` - Utils/hooks a testear (unit)

## Tareas Típicas
- Tests unitarios backend: `back/tests/*.test.js` (servicios, middlewares, utils)
- Tests integración API: `back/tests/*.integration.test.js` (supertest vs Express app)
- Tests unitarios frontend: `front/tests/*.test.ts` (schemas Zod, hooks, utils)
- Tests E2E críticos: `front/tests/*.e2e.test.ts` (Playwright - cuando se configure)
- Cobertura: `npm test -- --coverage` (target: >70% services, >50% utils)
- Linting: `npm run lint` en front y back

## Restricciones OBLIGATORIAS
- Usar Jest configurado en `chalannge-teasting/` (no crear nueva config)
- Mocks obligatorios para: OpenAI SDK, Mongoose (en unit tests), fetch/axios
- Tests rápidos: < 5s unit, < 30s integration
- Nombrado: `*.test.js` (back), `*.test.ts` (front)
- Estructura AAA: Arrange, Act, Assert
- Un test = una aserción principal
- No tests de implementación (testear comportamiento, no internos)

## Patrones de Código Base
```javascript
// back/tests/moviesService.test.js
const moviesService = require('../../src/services/moviesService');
const Movie = require('../../src/models/movieModel');

jest.mock('../../src/models/movieModel');

describe('moviesService', () => {
  beforeEach(() => jest.clearAllMocks());
  
  describe('create', () => {
    it('debería crear y retornar película', async () => {
      const mockMovie = { _id: '1', title: 'Test', save: jest.fn().mockResolvedValue() };
      Movie.mockImplementation(() => mockMovie);
      
      const result = await moviesService.create({ title: 'Test', year: 2024, ... });
      
      expect(result.title).toBe('Test');
      expect(mockMovie.save).toHaveBeenCalled();
    });
  });
});

// back/tests/movies.integration.test.js
const request = require('supertest');
const app = require('../../src/server');

describe('POST /api/v1/movies', () => {
  it('debería retornar 400 si faltan campos', async () => {
    await request(app)
      .post('/api/v1/movies')
      .send({})
      .expect(400)
      .expect(res => {
        expect(res.body.success).toBe(false);
        expect(res.body.code).toBe('VALIDATION_ERROR');
      });
  });
});
```

## Herramientas Permitidas
Read, Write, Edit, Bash (solo en `back/tests/`, `front/tests/`, `chalannge-teasting/`, `spec/`)

## Output Esperado
- Tests nuevos/modificados pasando
- Cobertura report generado
- Lint sin errores
- `tasks.md` checkboxes completados
- Reporte breve: "X tests added, Y% coverage"