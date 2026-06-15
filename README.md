# MiniBlog API

**Autor:** JuanCamilo Castellanos. ([@DonJuanC](https://github.com/DonJuanC))
**Bootcamp:** Henry — Full Stack — Módulo 2 · Proyecto Integrador
**Repositorio:** https://github.com/DonJuanC/miniblog-api
**Deploy:** https://miniblog-api-production-10ba.up.railway.app

API REST en Node.js + Express con PostgreSQL para gestión de authors y posts.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalación local

```bash
npm install
```

Copia `.env.example` a `.env` y completa tus credenciales:

```bash
cp .env.example .env
```

Variables requeridas:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3000
```

Crea las tablas y carga los datos iniciales:

```bash
psql -U postgres -d miniblog -f src/db/setup.sql
psql -U postgres -d miniblog -f src/db/seed.sql
psql -U postgres -d miniblog -f src/db/comments_setup.sql
```

Inicia el servidor:

```bash
node index.js
```

## Endpoints

| Método | Ruta                    | Descripción        |
| ------ | ----------------------- | ------------------ |
| GET    | /authors                | Listar authors     |
| GET    | /authors/:id            | Obtener author     |
| POST   | /authors                | Crear author       |
| PUT    | /authors/:id            | Actualizar author  |
| DELETE | /authors/:id            | Eliminar author    |
| GET    | /posts                  | Listar posts       |
| GET    | /posts/:id              | Obtener post       |
| GET    | /posts/author/:authorId | Posts de un author |
| POST   | /posts                  | Crear post         |
| PUT    | /posts/:id              | Actualizar post    |
| DELETE | /posts/:id              | Eliminar post      |
| GET    | /posts/:id/comments     | Listar comentarios |
| POST   | /posts/:id/comments     | Crear comentario   |

## Tests

```bash
npm test
```

## Documentación OpenAPI

El archivo `openapi.yaml` en la raíz describe todos los endpoints. Para visualizarlo e interactuar con la API en vivo:

1. Abre [editor.swagger.io](https://editor.swagger.io)
2. Borra el contenido por defecto y pega el contenido de `openapi.yaml`
3. Selecciona el servidor **Producción (Railway)** en el dropdown
4. Usa **Try it out → Execute** en cualquier endpoint para hacer requests reales

## Deploy en Railway

**URL pública:** https://miniblog-api-production-10ba.up.railway.app

1. Crea un proyecto en [railway.app](https://railway.app)
2. Agrega un servicio PostgreSQL desde el dashboard
3. Conecta tu repositorio de GitHub
4. En Variables del servicio API, agrega referencias al servicio PostgreSQL:

| Variable      | Valor                      |
| ------------- | -------------------------- |
| `DB_HOST`     | `${{Postgres.PGHOST}}`     |
| `DB_PORT`     | `${{Postgres.PGPORT}}`     |
| `DB_NAME`     | `${{Postgres.PGDATABASE}}` |
| `DB_USER`     | `${{Postgres.PGUSER}}`     |
| `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `NODE_ENV`    | `production`               |

5. Railway despliega automáticamente en cada push a main
6. Ejecutar setup y seed en la DB de Railway desde la pestaña **Console** del servicio PostgreSQL

## Uso de IA

Este proyecto fue desarrollado con asistencia de **Claude (Anthropic)** como interlocutor técnico. El proceso no fue de generación automática: cada respuesta se evaluó, se probó y, cuando era necesario, se iteró el prompt con el error concreto o el contexto faltante. El código se aceptó solo cuando se entendía qué hacía cada línea y los tests lo respaldaban.

### Proceso general

Cada consulta a la IA incluyó contexto explícito: stack (Node.js + Express + `pg`, sin ORM), estado actual del código, problema específico y restricciones del módulo. Cuando la primera respuesta no cubría todos los casos, se iteró con el error real o el gap identificado hasta llegar a una solución verificable.

### Prompts principales, contexto dado y validación

| Área              | Contexto dado a la IA                                                                | Qué aportó la IA                                                                                 | Qué se verificó / adaptó                                                                           |
| ----------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Schema SQL        | Stack Node + pg, relación 1:N authors → posts, necesidad de CASCADE al borrar author | Estructura de `setup.sql` con `FOREIGN KEY ... ON DELETE CASCADE`                                | Se ejecutó en psql local y se verificó que un DELETE en authors eliminaba los posts asociados      |
| Conexión DB       | Contexto de múltiples requests concurrentes en Express; duda Pool vs. Client         | Uso de `pg.Pool`; explicación de por qué Client agota conexiones                                 | Se probó con varias requests simultáneas; se confirmó que Pool reutilizaba conexiones sin errores  |
| Rutas Express     | Código real de `posts.js` con la ruta `/author/:authorId` fallando; error 404        | Identificación del conflicto de orden con `/:id`; regla "rutas específicas primero"              | Se reordenó y se verificó con requests a ambas rutas que ya no había colisión                      |
| Updates parciales | Query de UPDATE que sobreescribía campos `null` cuando no se enviaban en el body     | Patrón `COALESCE($1, campo)` en el query SQL                                                     | Se probó con PUT enviando solo `name`, confirmando que `email` y `bio` no se tocaban               |
| Testing           | Duda sobre cómo testear HTTP sin servidor real; stack Jest disponible                | Configuración de Supertest + `afterAll(pool.end)` para cerrar conexión                           | Se corrió `npm test`; se confirmó que los 9 tests pasaban y el proceso terminaba sin colgar        |
| Deploy SSL        | Error `{error: ''}` en Railway; sin stack trace visible; `NODE_ENV=production`       | Hipótesis de SSL estricto en pg → `ssl: { rejectUnauthorized: false }` condicionado a producción | Se iteró el prompt con el error real. Se verificó con curl que la API respondía 200 en Railway     |
| CORS              | Error "Failed to fetch" en Swagger UI al ejecutar contra Railway                     | Instalación de `cors` npm + `app.use(cors())` en `index.js`                                      | Se verificó con `curl -I` que el header `access-control-allow-origin: *` estaba presente           |
| Auditoría         | Rúbrica completa + código fuente del proyecto + consigna del módulo                  | Identificación de 3 gaps: dotenv fuera de lugar, 23503 sin manejar, tests solo de authors        | Se aplicaron los 3 fixes, se corrió `npm test` y se hizo push a Railway confirmando deploy exitoso |

### Licencia de uso

Este proyecto es de uso académico. El código fue escrito y comprendido por el autor — la IA actuó como recurso de aprendizaje y herramienta de exploración, no como generador de entregables.
