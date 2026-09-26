# Proyecto Cinema
Aplicación de gestión de películas con CRUD completo. Pensada para usuarios que quieran administrar información de películas desde una interfaz web sencilla.

## Stack
- Lenguaje: JavaScript (Node.js + Vanilla JS)
- Framework / runtime: Node 22 + Express 5
- Base de datos: MongoDB Atlas (Mongoose ODM)
- Tests: Jest (mocks, expects, funciones simuladas)

## Comandos
- `npm start` (en carpeta back) — arranca el servidor en local
- `npm run build` (en carpeta front) — compila el frontend con Webpack
- `npm test` (en carpeta chalannge-teasting) — ejecuta los tests (deben pasar antes de cada commit)
- `npm run lint` — revisa el estilo (antes de cada PR)

## Estructura del proyecto
- `front/` — interfaz de usuario (HTML, CSS, Bootstrap, AJAX, Axios)
- `back/` — API REST con Express, controladores, servicios y middlewares
- `chalannge-teasting/` — pruebas unitarias e integraciones con Jest

## Convenciones
- camelCase para variables y funciones
- Tests en `chalannge-teasting/` separados del código principal
- Manejo de errores centralizado en `back/utils/errors.js`
- Validar toda entrada del usuario antes de usarla

## No hagas
- No instalar dependencias sin avisar
- No subir archivos `.env*` al repositorio
- No usar callbacks anidados; preferir async/await o promesas
- No romper la modularización del backend (mantener controladores, servicios y rutas separados)

## Flujo de trabajo
- Antes de una tarea no trivial, propón un plan y espera aprobación
- Una tarea a la vez; al terminar, explica qué cambiaste
- Si no estás seguro al 80%, pregunta. No inventes

## Documentación
- Revisar `README.md` para instrucciones iniciales
- Configuración global en `~/.config/opencode/`
- Referencias: MongoDB Atlas docs, Express 5 docs, Jest docs
