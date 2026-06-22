// Manejador de errores centralizado. Las rutas ya no responden directamente
// sus catch: llaman next(err) y este middleware decide el status code y el
// mensaje, sin exponer nunca el detalle crudo de Postgres al cliente.

const FK_MESSAGES = {
  posts_author_id_fkey: "El author_id no existe",
  comments_post_id_fkey: "El post_id no existe",
  comments_author_id_fkey: "El author_id no existe",
};

const UNIQUE_MESSAGES = {
  authors_email_key: "El email ya existe",
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Errores de validación propios (ej. validateId) ya traen status definido
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // 23503 = foreign_key_violation
  if (err.code === "23503") {
    return res.status(400).json({
      error:
        FK_MESSAGES[err.constraint] ||
        "Referencia inválida: el recurso relacionado no existe",
    });
  }

  // 23505 = unique_violation
  if (err.code === "23505") {
    return res.status(400).json({
      error: UNIQUE_MESSAGES[err.constraint] || "El valor ya existe (debe ser único)",
    });
  }

  // Clase 22 de Postgres = Data Exception (formato/tipo inválido, fuera de rango, etc.)
  if (err.code && err.code.startsWith("22")) {
    return res.status(400).json({ error: "Datos de entrada inválidos" });
  }

  // Cualquier otro error: 500, ocultando el detalle interno en producción
  const isProduction = process.env.NODE_ENV === "production";
  res.status(500).json({
    error: isProduction ? "Error interno del servidor" : err.message,
  });
};

module.exports = errorHandler;
