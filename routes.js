const express = require('express'); 
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');

//Homes routes
route.get('/', homeController.homePage);

//Login routes
route.get('/login', loginController.login);

//Register routes
route.get('/signin', loginController.signIn);
route.post('/login/register', loginController.register);



module.exports = route;
