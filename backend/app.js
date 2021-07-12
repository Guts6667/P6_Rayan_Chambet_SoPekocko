const express = require('express'); // On importe express
const bodyParser = require('body-parser'); // On importe body-parser qui va transfermer les corps des requêtes en JSON
const path = require('path');

//Modules de sécurité 
const helmet = require('helmet'); /*Package de sécurité helmet*/
const xssClean = require('xss-clean');
const cookieSession = require('cookie-session');

//Désactive la mise en cache coté client
const noCache = require('nocache');


//Module npm charge les variables d'environnement
const db = require('./config');


//Variable de stockage de routes
const sauceRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');

//Connexion MONGOOSE
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://<Nom Utilisateur>:<Mot de passe>@cluster0.bfsdx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//Appel d'express dans l'application
const app = express();

//Appel du package de sécurité helmet
app.use(helmet());

// Middleware général, appliqué à toutes les routes vers le serveur. (Pas de route spécifique)
app.use((req, res, next) => {

   // On autorise l'accès à l'API depuis n'importe quelle origine ('*').
    res.setHeader('Access-Control-Allow-Origin', '*');
    //On autorise l'utilisation de certains headers sur l'objet requête
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // On autorise différentes méthodes de requêtes (GET, POST, PUT, etc)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Cookie-session
const expiryDate = new Date( Date.now() + 60 * 60 * 1000); //1h

app.use(
  cookieSession({
    name : 'session',
    keys : ['key1', 'key2'],
    cookie: {
      secure: true, 
      //Garantit que le navigateur envoie le cookie sur HTTPS
      httpOnly: true, 
      /* Garantit que le cookie n’est envoyé que sur HTTP(S), pas au JavaScript du client, 
      ce qui renforce la protection contre les attaques de type cross-site scripting. */
      domain: 'http://localhost:3000/',
      expires: expiryDate // Création d'une date d'expiration (contre les cookies persistants)
    }
  })
);

// Désactive les caches
app.use(noCache());

//Methode qui neutralise l'en-tête et empêcher les attaques ciblés 
app.disable('x-powered-by');

//Traite les requêtes post en objet json
app.use(bodyParser.json());

//Methode qui nettoie les entrées utili du corps POST, requêtes GET et des paramètres URL
app.use(xssClean());


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes); //Import des logiques de route sauces
app.use('/api/auth', userRoutes); //Import des logiques de route user

module.exports = app; // On exporte express dans l'application au début
