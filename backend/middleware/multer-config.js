const multer = require('multer'); /*Récupération du package multer : Permet de gérer les fichiers entrant*/

/* Dictionnaire MIME permettant de définir le format des images*/
const MIME_TYPES = { 
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({ //Fonction diskStorage() permet d'enregister sur le disque
  destination: (req, file, callback) => { // On indique dans quel dossier enregistrer les fichiers
    callback(null, 'images'); 
  },
  filename: (req, file, callback) => { 
    const name = file.originalname.split(' ').join('_'); // La propriété originalname permet de garde le nom d'origine du fichier
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); // On générera le nom du fichier avec son nom d'origine, sa date et son extension
 
  }
});

module.exports = multer({storage: storage}).single('image'); 
// Exportation de multer (accepte seulement les images)