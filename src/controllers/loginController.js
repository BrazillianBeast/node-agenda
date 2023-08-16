const Login = require('../models/LoginModel');

exports.login = (req,res) => {
    res.render('login'); 
    return;
};

exports.signIn = (req, res) => {
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
