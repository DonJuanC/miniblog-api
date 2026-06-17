const express = require("express");
const router = express.Router({ mergeParams: true });
const service = require("../services/comments.service.js");

// GET /posts/:id/comments
router.get("/", async (req, res) => {
  try {
    const comments = await service.getByPostId(req.params.id);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts/:id/comments
router.post("/", async (req, res) => {
  try {
    const { content, author_id } = req.body;
    if (!content || !author_id)
      return res
        .status(400)
        .json({ error: "content y author_id son requeridos" });
    const comment = await service.create({
      content,
      post_id: req.params.id,
      author_id,
    });
    res.status(201).json(comment);
  } catch (err) {
    if (err.code === "23503")
      return res
        .status(400)
        .json({ error: "El post_id o author_id no existe" });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
