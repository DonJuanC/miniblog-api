const pool = require("../db/index.js");

const getByPostId = async (postId) => {
  const result = await pool.query(
    "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
    [postId]
  );
  return result.rows;
};

const create = async ({ content, post_id, author_id }) => {
  const result = await pool.query(
    "INSERT INTO comments (content, post_id, author_id) VALUES ($1, $2, $3) RETURNING *",
    [content, post_id, author_id]
  );
  return result.rows[0];
};

module.exports = { getByPostId, create };
