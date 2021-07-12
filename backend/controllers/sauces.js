const Sauce = require('../models/Sauces');// Récupération du modèle "sauce"
const fs = require('fs'); // fs = File System pour téléchargement d'images


//Middleware pour créer des sauces
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // On obtient un objet utilisable grace à JSON.parse()
    delete sauceObject._id; // Suppresion de l'id généré automatiquement/Création des ID générés automatiquement par MongoDB
    const sauce = new Sauce({ // Création d'une instance de Sauce
        ...sauceObject,
        // Utilisation de l'opérateur spread "..."pour copier tous les éléments du body de notre requête 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        // Récupération des segments de l'image modifiée par multer
    });
    sauce.save() // Sauvegarde de la sauce dans la BDD
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};


// Middleware de modification
exports.modifySauce = (req, res, next) =>{
    const sauceObject = req.file ? // Si req.file existe alors
    { //On récupére les infos comme pour post 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { // sinon on prend simplement le corps de la requête
        ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject,  _id: req.params.id })
    /*Mise à jour la sauce dans notre base de donnée, le premier argument est l'objet de comparaison,
    et le second c'est le nouvel objet en utilisant le spread pour récup la sauce dans le corps de la requete. */
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
};


// Middleware de suppression
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // on trouve le fichier avec son id
      .then(sauce => {  // récupération du nom du fichier précis
        const filename = sauce.imageUrl.split('/images/')[1]; // on split pour retrouver le bon nom
        fs.unlink(`images/${filename}`, () => { //fs.unlink nous permet de le supprimer du système
            Sauce.deleteOne({ _id: req.params.id })
            // On passe un objet (id) correspondant au fichier à supprimer de la base
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};


// Middleware pour récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
};


// Middleware pour récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find() 
    //methode "find()" renvoie le tableau contenant toutes les sauces
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
};




// Middleware pour liker/disliker
exports.stateOfSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const like = sauce.usersLiked.findIndex(e => e == req.body.userId);
        const dislike = sauce.usersDisliked.findIndex(e => e == req.body.userId);
        const sauceObject = req.body.like;

        switch ( sauceObject ) {
            // Like
            case 1: 
                if (like <= -1) {
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes += 1;
                } 
            break;

            //Dislike
            case -1: 
                if (dislike <= -1){
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes += 1;
                }
            break;

            //Annulation like/dislike
            case 0: 
                if (like > -1) {
                    sauce.usersLiked.splice(like, 1);
                    sauce.likes -= 1;
                } 
                
                if (dislike > -1){
                    sauce.usersDisliked.splice(dislike, 1);
                    sauce.dislikes -= 1;
                }
            break;
        }

        
        Sauce.updateOne({ _id: req.params.id },
          {
            likes: sauce.likes,
            dislikes: sauce.dislikes,
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked,
          }
        ).then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
};