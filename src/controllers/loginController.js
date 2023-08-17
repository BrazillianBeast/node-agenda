const Login = require('../models/LoginModel');

exports.login = (req,res) => {
    if(req.session.user) return res.render('login-logged');
    return res.render('login'); 
};

exports.signIn = (req, res) => {
    if(req.session.user) return res.render('login-logged');
    res.render('signin');
    return;
};

exports.register = async function (req, res) {
    try{
        const login = new Login(req.body);
        await login.register();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function(){
                return res.redirect('/signin');
            });
            return;
        }
        req.flash('sucess', 'You user has been successfully created');
            req.session.save(function(){
                return res.redirect('/signin');
            });

    } catch(e){
        console.log(e);
        return res.render('404');
    }
    
};

exports.authenticate = async function (req, res) {
    try{
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function(){
                return res.redirect('/login');
            });
            return;
        }

        req.flash('sucess', 'You logged in successfully');
        req.session.user = login.user;
        req.session.save(function(){
            return res.redirect('/');
        });

    } catch(e){
        console.log(e);
        return res.render('404');
    }
    
};

exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/login');
}
