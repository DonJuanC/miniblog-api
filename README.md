# MiniBlog API

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

## Tests

```bash
npm test
```

## Documentación OpenAPI

El archivo `openapi.yaml` en la raíz describe todos los endpoints. Puedes visualizarlo en [editor.swagger.io](https://editor.swagger.io) pegando el contenido del archivo.

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

Este proyecto fue desarrollado con asistencia de Claude (Anthropic) como tutor técnico. Claude guió el desarrollo con un método de paso a paso — explicando conceptos, revisando código y señalando errores — sin ejecutar acciones directamente salvo cuando se le autorizó explícitamente. Los prompts utilizados cubrieron: diseño del schema SQL, estructura de rutas Express, conexión con pg Pool, arquitectura de servicios, configuración de jest/supertest y preparación para Railway.
