const express = require("express");
const router = express.Router();
const service = require("../services/authors.service.js");

// GET /authors
router.get("/", async (req, res) => {
  try {
    const authors = await service.getAll();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /authors/:id
router.get("/:id", async (req, res) => {
  try {
    const author = await service.getById(req.params.id);
    if (!author) return res.status(404).json({ error: "Author no encontrado" });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /authors
router.post("/", async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "name y email son requeridos" });
    const author = await service.create({ name, email, bio });
    res.status(201).json(author);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "El email ya existe" });
    res.status(500).json({ error: err.message });
  }
});

// PUT /authors/:id
router.put("/:id", async (req, res) => {
  try {
    const author = await service.update(req.params.id, req.body);
    if (!author) return res.status(404).json({ error: "Author no encontrado" });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /authors/:id
router.delete("/:id", async (req, res) => {
  try {
    const author = await service.remove(req.params.id);
    if (!author) return res.status(404).json({ error: "Author no encontrado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
