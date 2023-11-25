const express = require("express");
const { validationResult } = require("express-validator");
const Recette = require("../models/recetteModel"); // Importez le modèle de données pour les recettes
const { validateRecipeData } = require("../middlewares/validationMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Créer une recette
router.post("/", verifyToken, validateRecipeData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, nom, ingredients, etapes, tempsPreparation, photo } =
      req.body;
    const nouvelleRecette = new Recette({
      userId,
      nom,
      ingredients,
      etapes,
      tempsPreparation,
      photo,
    });
    const savedRecette = await nouvelleRecette.save();
    res.status(201).json(savedRecette);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtenir toutes les recettes
router.get("/", verifyToken, async (req, res) => {
  try {
    const recettes = await Recette.find({ userId: req.userId });
    res.json(recettes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir une recette par son ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }
    if (recette.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Accès non autorisé à cette recette" });
    }
    res.json(recette);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour une recette par son ID
router.put("/:id", verifyToken, validateRecipeData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nom, ingredients, etapes, tempsPreparation, photo } = req.body;
    const updatedRecette = await Recette.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { nom, ingredients, etapes, tempsPreparation, photo },
      { new: true }
    );
    if (!updatedRecette) {
      return res
        .status(404)
        .json({ message: "Recette non trouvée ou accès non autorisé" });
    }
    res.json(updatedRecette);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer une recette par son ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedRecette = await Recette.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deletedRecette) {
      return res
        .status(404)
        .json({ message: "Recette non trouvée ou accès non autorisé" });
    }
    res.json({ message: "Recette supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
