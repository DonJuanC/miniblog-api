const express = require("express");
const router = express.Router({ mergeParams: true });
const service = require("../services/comments.service.js");
const validateId = require("../middlewares/validateId.js");
const { isNonEmptyString, isPositiveInteger } = require("../utils/validators.js");

// El :id viene del mount en index.js (/posts/:id/comments)
router.use(validateId("id"));

// GET /posts/:id/comments
router.get("/", async (req, res, next) => {
  try {
    const comments = await service.getByPostId(req.params.id);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
});

// POST /posts/:id/comments
router.post("/", async (req, res, next) => {
  try {
    const { content, author_id } = req.body;
    if (!isNonEmptyString(content) || !isPositiveInteger(author_id)) {
      return res.status(400).json({
        error: "content debe ser texto no vacío y author_id un entero positivo",
      });
    }
    const comment = await service.create({
      content,
      post_id: req.params.id,
      author_id,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
