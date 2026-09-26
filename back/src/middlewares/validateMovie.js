const Joi = require("joi");

const movieSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.empty": "El título es obligatorio",
    "string.max": "El título no puede exceder 200 caracteres",
    "any.required": "El título es obligatorio",
  }),
  year: Joi.number().integer().min(1888).max(new Date().getFullYear()).required().messages({
    "number.base": "El año debe ser un número",
    "number.integer": "El año debe ser un número entero",
    "number.min": `El año debe ser mayor o igual a 1888`,
    "number.max": `El año no puede ser mayor a ${new Date().getFullYear()}`,
    "any.required": "El año es obligatorio",
  }),
  director: Joi.string().min(1).max(100).required().messages({
    "string.empty": "El director es obligatorio",
    "string.max": "El director no puede exceder 100 caracteres",
    "any.required": "El director es obligatorio",
  }),
  duration: Joi.string().min(1).max(50).required().messages({
    "string.empty": "La duración es obligatoria",
    "string.max": "La duración no puede exceder 50 caracteres",
    "any.required": "La duración es obligatoria",
  }),
  genres: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.base": "Los géneros deben ser un array",
    "array.min": "Debe seleccionar al menos un género",
    "any.required": "Los géneros son obligatorios",
  }),
  rate: Joi.number().min(0).max(10).precision(1).required().messages({
    "number.base": "La calificación debe ser un número",
    "number.min": "La calificación debe ser mayor o igual a 0",
    "number.max": "La calificación debe ser menor o igual a 10",
    "number.precision": "La calificación debe tener máximo 1 decimal",
    "any.required": "La calificación es obligatoria",
  }),
  poster: Joi.string().uri().required().messages({
    "string.empty": "La URL del poster es obligatoria",
    "string.uri": "La URL del poster debe ser una URL válida",
    "any.required": "La URL del poster es obligatoria",
  }),
});

const validateMovie = (req, res, next) => {
  const { error } = movieSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: "Datos de validación inválidos", errors });
  }
  next();
};

module.exports = { validateMovie };
