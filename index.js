require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const authorsRouter = require("./src/routes/authors");
const postsRouter = require("./src/routes/posts");
const commentsRouter = require("./src/routes/comments");

app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);
app.use("/posts/:id/comments", commentsRouter);

const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
