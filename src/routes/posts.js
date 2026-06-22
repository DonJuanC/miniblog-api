const express = require("express");
const router = express.Router();
const service = require("../services/posts.service.js");
const validateId = require("../middlewares/validateId.js");
const { isNonEmptyString, isPositiveInteger } = require("../utils/validators.js");

// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await service.getAll();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /posts/author/:authorId
router.get("/author/:authorId", validateId("authorId"), async (req, res, next) => {
  try {
    const posts = await service.getByAuthorId(req.params.authorId);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /posts/:id
router.get("/:id", validateId(), async (req, res, next) => {
  try {
    const post = await service.getById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

// POST /posts
router.post("/", async (req, res, next) => {
  try {
    const { title, content, author_id } = req.body;
    if (
      !isNonEmptyString(title) ||
      !isNonEmptyString(content) ||
      !isPositiveInteger(author_id)
    ) {
      return res.status(400).json({
        error:
          "title y content deben ser texto no vacío, author_id debe ser un entero positivo",
      });
    }
    const post = await service.create({ title, content, author_id });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

// PUT /posts/:id
router.put("/:id", validateId(), async (req, res, next) => {
  try {
    const { title, content, published } = req.body;
    if (title !== undefined && !isNonEmptyString(title)) {
      return res.status(400).json({ error: "title debe ser texto no vacío" });
    }
    if (content !== undefined && !isNonEmptyString(content)) {
      return res.status(400).json({ error: "content debe ser texto no vacío" });
    }
    if (published !== undefined && typeof published !== "boolean") {
      return res.status(400).json({ error: "published debe ser booleano" });
    }

    const post = await service.update(req.params.id, { title, content, published });
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

// DELETE /posts/:id
router.delete("/:id", validateId(), async (req, res, next) => {
  try {
    const post = await service.remove(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
