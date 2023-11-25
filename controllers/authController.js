const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Importez le modèle de données pour les utilisateurs

const router = express.Router();

// Route pour l'inscription
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Vérifiez si l'utilisateur existe déjà dans la base de données (par exemple, User.findOne)

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur enregistré avec succès" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour la connexion et génération du token JWT
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, "your_secret_key_here", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
