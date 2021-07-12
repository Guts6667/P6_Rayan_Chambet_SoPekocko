const emailValidator = require('validator'); // Package validator pour valider et assainir l'input email : De façon à recevoir que des strings


module.exports = (req, res, next) =>{
    if (!emailValidator.isEmail(req.body.email)){ // Si entrée invalide
        return res.status(400).json({error: "email pas valide: exemple@domaine.fr"}) //Renvoie d'un message d'erreur
    } else{ 
        next();
    }
};