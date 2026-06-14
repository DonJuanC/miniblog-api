const pool = require("../db/index.js");

const getAll = async () => {
  const result = await pool.query("SELECT * FROM authors ORDER BY id");
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);
  return result.rows[0];
};

const create = async ({ name, email, bio }) => {
  const result = await pool.query(
    "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *",
    [name, email, bio],
  );
  return result.rows[0];
};

const update = async (id, { name, email, bio }) => {
  const result = await pool.query(
    "UPDATE authors SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING *",
    [name, email, bio, id],
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    "DELETE FROM authors WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

module.exports = { getAll, getById, create, update, remove };
