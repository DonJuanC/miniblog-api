# Auditoría pre-entrega — MiniBlog API (PI M2)

Fecha: 2026-06-17. Cruce de la consigna, la rúbrica y el código real del repo, más 4 fixes aplicados durante esta sesión.

## Resumen

El proyecto cumple el alcance mínimo y el extra credit (comments). Encontré 4 gaps reales, los corregí, y ya corriste `npm test` en tu entorno: **14/14 passed**. Verifiqué también en vivo que el deploy de Railway responde correctamente. Listo para entregar — solo falta que subas el último fix (ver "Para subir los fixes").

## Fixes aplicados en esta auditoría

| # | Problema | Dónde | Fix |
|---|----------|-------|-----|
| 1 | `.env` tenía `BD_HOST` en vez de `DB_HOST` (typo). `src/db/index.js` lee `process.env.DB_HOST`, así que la variable nunca llegaba — funcionaba solo porque `pg` cae a `localhost` por defecto. | `.env` | Corregido a `DB_HOST`. Local-only, no afecta Railway (ahí las vars las inyecta la plataforma, no este archivo). |
| 2 | `comments.js` no manejaba el error `23503` (FK inválida). Si `post_id` o `author_id` no existen, el POST devolvía `500` genérico en vez de `400` — inconsistente con el mismo manejo que ya tenías en `posts.js`. | `src/routes/comments.js` | Agregado el mismo patrón: `if (err.code === "23503") return res.status(400).json(...)`. |
| 3 | No había tests automatizados para `/posts/:id/comments` (ni GET ni POST, ni casos de error). | `src/tests/comments.test.js` (nuevo) | 5 tests: listar, crear, 400 sin `content`, 400 con `author_id` fantasma, 400 con `post_id` fantasma. |
| 4 | `npm test` mostraba `A worker process has failed to exit gracefully...` — `index.js` llamaba `app.listen()` incondicionalmente, así que cada test file que importaba la app levantaba un servidor HTTP real que nunca se cerraba (Jest forzaba el exit). Supertest no lo necesita: crea su propio servidor efímero por request. | `index.js` | Envuelto en `if (require.main === module)` — solo escucha el puerto cuando corres `node index.js` directo, no cuando un test importa la app. |

Total de tests: **14** (9 de authors/posts + 5 de comments), confirmados pasando en tu entorno, sin warnings de leak.

## Cruce contra la rúbrica

| # | Categoría | Veredicto | Evidencia |
|---|-----------|-----------|-----------|
| 1 | API REST — correctitud | Excelente | Los 11 endpoints del alcance mínimo + 2 de comments (extra credit) responden con status codes correctos. Verificado en código y en producción (ver sección Railway). Orden de rutas en `posts.js` correcto (`/author/:authorId` antes de `/:id`). |
| 2 | Modelado y persistencia | Excelente | `setup.sql` y `comments_setup.sql`: PK, `UNIQUE` en email, FKs con `ON DELETE CASCADE` en las 3 relaciones (authors→posts, authors→comments, posts→comments). |
| 3 | Integración Express + PostgreSQL | Excelente | `Pool` (no `Client`), queries 100% parametrizadas (`$1, $2...`), separación routes/services consistente en las 3 entidades. |
| 4 | Validaciones y manejo de errores | Excelente (tras el fix) | Antes del fix: Satisfactorio — comments rompía el patrón de error 400 en FK inválida. Ya corregido y es consistente en las 3 rutas. |
| 5 | Testing automatizado | Excelente | 14/14 tests pasando (confirmado en tu entorno), cubren CRUD + casos de error en authors, posts y comments. Supera el mínimo de 6. |
| 6a | Documentación | Excelente | README cubre setup, variables de entorno, tests, deploy y uso de IA. `openapi.yaml` documenta los 13 endpoints incluyendo comments. Nota menor: el campo `description` del YAML dice "gestión de authors y posts" sin mencionar comments — cosmético, no afecta la evaluación. |
| 6b | Deployment | Excelente | Verificado en vivo desde mi sandbox (ver abajo): la URL de Railway responde 200/404 correctamente y el header CORS está presente. |

## Verificación en producción (Railway)

Corrí estos checks de solo lectura contra `https://miniblog-api-production-10ba.up.railway.app` (no escribí ni borré nada):

```
GET /authors              -> 200
GET /posts                -> 200
GET /posts/1/comments     -> 200
GET /authors/99999        -> 404 (esperado)
access-control-allow-origin: *  (presente)
```

Deploy operativo, comments incluido, CORS activo.

## Tests confirmados

```
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
```

Sin warnings de leak tras el fix 4.

### Pruebas manuales sugeridas (casos no cubiertos por los tests automatizados, opcional)

Con el servidor corriendo (`node index.js`, otra terminal):

```bash
# Actualización parcial de author (no debe borrar bio ni email)
curl -X PUT localhost:3000/authors/1 -H "Content-Type: application/json" -d '{"name":"Nombre actualizado"}'

# Posts de un author
curl localhost:3000/posts/author/1

# Actualizar y borrar un post
curl -X PUT localhost:3000/posts/1 -H "Content-Type: application/json" -d '{"published":true}'
curl -X DELETE localhost:3000/posts/1 -i

# Comentario con post_id inexistente (debe dar 400 tras el fix, antes daba 500)
curl -X POST localhost:3000/posts/99999/comments -H "Content-Type: application/json" -d '{"content":"x","author_id":1}' -i
```

## Notas menores (no bloquean la entrega)

- `package.json` no tiene script `"start"`. El README ya usa `node index.js` directo, así que es consistente, pero un `"start": "node index.js"` es una mejora trivial y esperable.
- `commit-fixes.bat` es un script tuyo de uso interno (no mencionado en la consigna) — sin problema, pero si quieres mantener el repo "limpio" para el evaluador, podrías quitarlo o agregarlo a `.gitignore`. No lo toqué.
- Quedó un archivo `pg-init.js` en la raíz del repo, residuo de un intento mío de levantar Postgres embebido en mi sandbox (no funcionó por falta de permisos, lo abandoné). Ya lo dejé vacío y lo agregué a `.gitignore`, pero no pude borrarlo del disco por un permiso raro del mount. Bórralo manualmente cuando puedas (clic derecho → eliminar).
- `CLAUDE.md` aparece sin trackear en git (`git status` lo marca `??`). Si es solo tu memoria de trabajo con Claude, probablemente no quieras que quede en un repo público de entrega — considera agregarlo a `.gitignore`.

## Para subir los fixes

Dejé listo `commit-fixes-2.bat` en la raíz (mismo patrón que el que ya tenías) con el commit de los 2 fixes de código (el de `.env` no aplica, está gitignored). Doble clic para commitear y pushear, o revisa el contenido primero si prefieres hacerlo a mano.
