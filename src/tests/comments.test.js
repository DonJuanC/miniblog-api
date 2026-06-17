const request = require("supertest");
const app = require("../../index.js");
const pool = require("../../src/db/index.js");

afterAll(async () => {
  await pool.end();
});

describe("Comments API", () => {
  it("GET /posts/:id/comments - retorna lista de comentarios", async () => {
    const res = await request(app).get("/posts/1/comments");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /posts/:id/comments - crea un comentario nuevo", async () => {
    const res = await request(app).post("/posts/1/comments").send({
      content: "Comentario de prueba",
      author_id: 1,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("post_id", 1);
  });

  it("POST /posts/:id/comments - retorna 400 si falta content", async () => {
    const res = await request(app).post("/posts/1/comments").send({
      author_id: 1,
    });
    expect(res.statusCode).toBe(400);
  });

  it("POST /posts/:id/comments - retorna 400 si author_id no existe", async () => {
    const res = await request(app).post("/posts/1/comments").send({
      content: "Comentario con autor fantasma",
      author_id: 99999,
    });
    expect(res.statusCode).toBe(400);
  });

  it("POST /posts/:id/comments - retorna 400 si post_id no existe", async () => {
    const res = await request(app).post("/posts/99999/comments").send({
      content: "Comentario en post fantasma",
      author_id: 1,
    });
    expect(res.statusCode).toBe(400);
  });
});
