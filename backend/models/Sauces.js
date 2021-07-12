const mongoose = require('mongoose'); // On appelle Mongoose

const sauceSchema = mongoose.Schema({ // On créé un schéma de données avec toutes les informations nécessaires aux objets
    id: { type: String, require: true },
    userId: { type: String, require: true },
    name: { type: String, require: true },
    manufacturer: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number, require: true, default: 0 },
    dislikes: { type: Number, require: true, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

module.exports = mongoose.model('Sauce', sauceSchema);

//(Au-dessus) On exporte le modèle qui prend en argument, le nom du modèle 'Sauce' et le schéma 