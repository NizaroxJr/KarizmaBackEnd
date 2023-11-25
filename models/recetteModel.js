const mongoose = require("mongoose");

const recetteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  nom: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  etapes: [{ type: String, required: true }],
  tempsPreparation: { type: Number, required: true },
  photo: String,
});

const Recette = mongoose.model("Recette", recetteSchema);

module.exports = Recette;
