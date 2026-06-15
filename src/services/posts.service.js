const pool = require("../db/index.js");

const getAll = async () => {
  const result = await pool.query("SELECT * FROM posts ORDER BY id");
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  return result.rows[0];
};

const getByAuthorId = async (authorId) => {
  const result = await pool.query(
    "SELECT * FROM posts WHERE author_id = $1 ORDER BY id",
    [authorId],
  );
  return result.rows;
};

const create = async ({ title, content, author_id }) => {
  const result = await pool.query(
    "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, author_id],
  );
  return result.rows[0];
};

const update = async (id, { title, content, published }) => {
  const result = await pool.query(
    "UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *",
    [title, content, published, id],
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

module.exports = { getAll, getById, getByAuthorId, create, update, remove };
