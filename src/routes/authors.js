const express = require("express");
const router = express.Router();
const service = require("../services/authors.service.js");
const validateId = require("../middlewares/validateId.js");
const { isNonEmptyString, isValidEmail } = require("../utils/validators.js");

// GET /authors
router.get("/", async (req, res, next) => {
  try {
    const authors = await service.getAll();
    res.status(200).json(authors);
  } catch (err) {
    next(err);
  }
});

// GET /authors/:id
router.get("/:id", validateId(), async (req, res, next) => {
  try {
    const author = await service.getById(req.params.id);
    if (!author) return res.status(404).json({ error: "Author no encontrado" });
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
});

// POST /authors
router.post("/", async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    if (!isNonEmptyString(name) || !isValidEmail(email)) {
      return res.status(400).json({
        error: "name es requerido y email debe tener formato válido",
      });
    }
    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({ error: "bio debe ser texto" });
    }
    const author = await service.create({ name: name.trim(), email, bio });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
});

// PUT /authors/:id
router.put("/:id", validateId(), async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    if (name !== undefined && !isNonEmptyString(name)) {
      return res.status(400).json({ error: "name debe ser texto no vacío" });
    }
    if (email !== undefined && !isValidEmail(email)) {
      return res.status(400).json({ error: "email debe tener formato válido" });
    }
    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({ error: "bio debe ser texto" });
    }

    const author = await service.update(req.params.id, { name, email, bio });
    if (!author) return res.status(404).json({ error: "Author no encontrado" });
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
});

// DELETE /authors/:id
router.delete("/:id", validateId(), async (req, res, next) => {
  try {
    const author = await service.remove(req.params.id);
    if (!author) return res.status(404).json({ error: "Author no encontrado" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
