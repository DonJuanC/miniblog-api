const express = require("express");
const app = express();

app.use(express.json());

const authorsRouter = require("./src/routes/authors");
const postsRouter = require("./src/routes/posts");

app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
