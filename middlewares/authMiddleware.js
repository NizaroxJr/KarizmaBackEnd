const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  jwt.verify(token, "your_secret_key_here", (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
    req.userId = decodedToken.userId;
    next();
  });
};

module.exports = { verifyToken };
