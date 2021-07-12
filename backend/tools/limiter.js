const rateLimit = require('express-rate-limit'); // Import du package express-rate-limit : Limite le nombre de tentative vers l'API

const userLimiter = rateLimit({ // Limitation à 3 requêtes toutes les 3 minutes
  windowMs: 3 * 60 * 1000, 
  max: 3, //
  message: 'Trop de requêtes, veuillez attendre 3 minutes'
});

module.exports = {
  limiter: userLimiter
};