# Stack Tecnológico

## Frontend
- **Framework**: Next.js 14.2.0 (App Router)
- **UI**: React 18.3.0 + TypeScript 5.0
- **Estilos**: CSS Modules / Global CSS (sin Tailwind)
- **HTTP Client**: Axios 1.12.2
- **Dev Server**: next dev (puerto 3000)
- **Build**: next build (producción)

## Backend
- **Runtime**: Node.js + Express 5.1.0
- **Base de Datos**: MongoDB + Mongoose 8.18.2
- **IA**: OpenAI SDK 7.5.0 (GPT-4o-mini / configurable via env)
- **Config**: dotenv 17.2.2
- **Middleware**: cors 2.8.5, morgan 1.10.1
- **Dev**: nodemon 3.1.10 (puerto 3001)

## Modelo de Datos (MongoDB)
```javascript
// Movie / Hito cinematográfico
{
  title: String,           // Título de la película/hito
  year: Number,            // Año de estreno
  director: String,        // Director
  description: String,     // Descripción/reseña
  category: String,        // Categoría: "hito", "pelicula", "tecnologia", "personaje"
  verified: Boolean,       // Validado por curador
  source: String,          // Fuente bibliográfica/URL
  createdAt: Date,
  updatedAt: Date
}
```

## Comandos Principales
```bash
# Frontend
cd front && npm run dev      # Desarrollo (3000)
cd front && npm run build    # Build producción
cd front && npm run start    # Producción

# Backend
cd back && npm start         # Desarrollo con nodemon (3001)

# Tests
cd challenge-testing && npm test
```

## Variables de Entorno (back/.env)
```
MONGODB_URI=mongodb://localhost:27017/cine_db
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
PORT=3001
```

## Convenciones
- **Rutas API**: `/api/v1/movies`, `/api/v1/chatbot`, `/api/v1/assistant`
- **Componentes**: PascalCase en `front/app/components/`
- **Páginas**: `page.tsx` en `front/app/[ruta]/`
- **Servicios back**: `src/services/*.js` (lógica de negocio)
- **Controladores back**: `src/controllers/*.js` (HTTP handling)
- **Rutas back**: `src/routes/*.js` (endpoints)