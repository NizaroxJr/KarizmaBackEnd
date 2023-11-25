const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const recettesController = require("./controllers/recettesController");
const authController = require("./controllers/authController");
const { verifyToken } = require("./middlewares/authMiddleware");
const { validateRecipeData } = require("./middlewares/validationMiddleware");

const app = express();
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/recettes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on(
  "error",
  console.error.bind(console, "Erreur de connexion à MongoDB :")
);
mongoose.connection.once("open", () => {
  console.log("Connecté à MongoDB");
});

// Routes pour les recettes
app.use("/api/recettes", verifyToken, recettesController);

// Routes pour l'authentification
app.use("/api/auth", authController);

// Middleware pour exposer la documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Gestion des erreurs
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
