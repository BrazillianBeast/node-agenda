const express = require('express'); 
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contactController = require('./src/controllers/contactController');

const { loginRequired } = require('./src/middlewares/middleware');

//Homes routes
route.get('/', homeController.homePage);

//Login routes
route.get('/login', loginController.login);
route.post('/login/authenticate', loginController.authenticate);
route.get('/login/logout', loginController.logout);

//Register routes
route.get('/signin', loginController.signIn);
route.post('/login/register', loginController.register);

// Contacts router
route.get('/contact/index', loginRequired, contactController.index);
route.post('/contact/register', loginRequired, contactController.register);
route.get('/contact/index/:id', loginRequired, contactController.editByIndex);
route.post('/contact/edit/:id', loginRequired, contactController.edit);
route.get('/contact/delete/:id', loginRequired, contactController.delete);

module.exports = route;
