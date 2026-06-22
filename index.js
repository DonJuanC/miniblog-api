require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const app = express();

app.use(cors());
app.use(express.json());

const authorsRouter = require("./src/routes/authors");
const postsRouter = require("./src/routes/posts");
const commentsRouter = require("./src/routes/comments");

app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);
app.use("/posts/:id/comments", commentsRouter);

const swaggerDocument = YAML.load(path.join(__dirname, "openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;
