const request = require("supertest");
const app = require("../../index.js");
const pool = require("../../src/db/index.js");

afterAll(async () => {
  await pool.end();
});

describe("Authors API", () => {
  it("GET /authors - retorna lista de authors", async () => {
    const res = await request(app).get("/authors");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /authors/:id - retorna un author existente", async () => {
    const res = await request(app).get("/authors/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("POST /authors - crea un author nuevo", async () => {
    const res = await request(app)
      .post("/authors")
      .send({
        name: "Test User",
        email: `test${Date.now()}@test.com`,
        bio: "Bio de prueba",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("DELETE /authors/:id - retorna 404 si no existe", async () => {
    const res = await request(app).delete("/authors/99999");
    expect(res.statusCode).toBe(404);
  });

  it("POST /authors - retorna 400 si falta email", async () => {
    const res = await request(app)
      .post("/authors")
      .send({ name: "Sin Email" });
    expect(res.statusCode).toBe(400);
  });

  it("GET /authors/:id - retorna 404 si no existe", async () => {
    const res = await request(app).get("/authors/99999");
    expect(res.statusCode).toBe(404);
  });
});
