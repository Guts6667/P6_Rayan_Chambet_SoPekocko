const bcrypt = require('bcrypt'); // Import du package bcrypt pour hasher les mots de passe
const jwt = require('jsonwebtoken'); // Import de jsonwebtoken pour obtenir des token d'authentification


// Masquage des emails
const maskData = require('maskdata');

const emailMaskOpt = {
  maskWith: '*',
  unmaskedStartCharactersBeforeAt: 1, //Laisse 1 caractère apparement avant le @
  unmaskedEndCharactersAfterAt: 3, //Laisse 3 caractère apparement avant le @
  maskAtTheRate: false,
};

const User = require('../models/User');

/*Middleware d'inscription*/
exports.signup = (req, res, next) => {

  const regex = /^(?!.*[\s])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,100}$/; // Regex : chiffres/minuscules/majuscules/caractères spéciaux sauf espaces et sauts de lignes

  if (regex.test(req.body.password)){
    bcrypt.hash(req.body.password, 10) // Salage du mot de passe

    .then(hash => { 
        const user = new User({ 
          email: maskData.maskEmail2(req.body.email, emailMaskOpt),
          password: hash // Hash du mot de passe
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  } else {
    res.status(403).json({error: 'Le mot de passe est insuffisant! Il faut au moins 8 caractères dont : une majuscule, une minuscule, un chiffre' })
  }
    
};

/*Middleware de connexion*/
exports.login = (req, res, next) => {
    User.findOne({ email: maskData.maskEmail2(req.body.email, emailMaskOpt) })
      .then(user => { 
        if (!user) {// Si email inexistant 
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) 
        //Comparaison entre mot de passe et hash dans la base de donnée
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ // Réponse valide : renvoie l'id avec le token
              userId: user._id,
              token: jwt.sign( // Permet  d'encoder le token, il contient l'id de notre user une chaine secrète, validité de 24h
              
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};