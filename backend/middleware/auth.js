const jwt = require('jsonwebtoken'); /* Récupération de jsonwebtoken*/

/*Middleware d'authentification*/
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; 
        // Récupére les différentes données après le bearer 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
        // Utilise la fonction verify pour décoder le token si pas valide => erreur
        const userId = decodedToken.userId; // Extraction de l'id user du token
        if(req.body.userId && req.body.userId != userId) { // Comparaison de l'id user à l'id du token
            throw 'User ID non valable !'; // Sinon : erreur
        }else{
            next(); 
        }
    } catch (error){
        res.status(401).json({ error: error | 'Requête non authentifié !'})
    }
};