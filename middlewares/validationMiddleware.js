const { body, validationResult } = require("express-validator");

const validateRecipeData = [
  body("nom").notEmpty().withMessage("Le nom de la recette est requis"),
  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Au moins un ingrédient est requis"),
  body("etapes")
    .isArray({ min: 1 })
    .withMessage("Au moins une étape de préparation est requise"),
  body("tempsPreparation")
    .isNumeric()
    .withMessage("La durée de préparation doit être un nombre"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRecipeData,
  validate,
};
