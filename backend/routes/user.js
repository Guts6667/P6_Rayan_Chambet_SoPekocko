const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const limitUser = require('../tools/limiter')
const verifEmail = require('../middleware/email');


router.post('/signup',verifEmail, userCtrl.signup); 
router.post('/login',limitUser.limiter, userCtrl.login); 

module.exports = router;