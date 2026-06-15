const express = require("express");
const router = express.Router();
const service = require("../services/posts.service.js");

// GET /posts
router.get("/", async (req, res) => {
  try {
    const posts = await service.getAll();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts/author/:authorId
router.get("/author/:authorId", async (req, res) => {
  try {
    const posts = await service.getByAuthorId(req.params.authorId);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts/:id
router.get("/:id", async (req, res) => {
  try {
    const post = await service.getById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts
router.post("/", async (req, res) => {
  try {
    const { title, content, author_id } = req.body;
    if (!title || !content || !author_id)
      return res
        .status(400)
        .json({ error: "title, content y author_id son requeridos" });
    const post = await service.create({ title, content, author_id });
    res.status(201).json(post);
  } catch (err) {
    if (err.code === "23503")
      return res.status(400).json({ error: "El author_id no existe" });
    res.status(500).json({ error: err.message });
  }
});

// PUT /posts/:id
router.put("/:id", async (req, res) => {
  try {
    const post = await service.update(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const post = await service.remove(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
