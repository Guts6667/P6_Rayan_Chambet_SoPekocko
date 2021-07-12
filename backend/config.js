const app = require('./app'); 

require('dotenv').config() // permet de sécuriser les info sensibles

const db = { // process.env à les données définie dans le fichier .env
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    nameDb : process.env.DB_NAME,
}