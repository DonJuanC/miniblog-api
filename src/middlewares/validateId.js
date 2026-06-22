// Middleware reusable: valida que un parámetro de ruta sea un entero positivo
// antes de que llegue a la query SQL. Evita que Postgres reciba un valor no
// numérico y devuelva un 500 con el mensaje crudo del driver.
const validateId = (paramName = "id") => (req, res, next) => {
  const value = req.params[paramName];
  if (!/^\d+$/.test(value)) {
    const err = new Error(`El parámetro ${paramName} debe ser un número entero`);
    err.status = 400;
    return next(err);
  }
  next();
};

module.exports = validateId;
