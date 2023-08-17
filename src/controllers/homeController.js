const { version } = require('mongoose');
const HomeModel = require('../models/HomeModel');

exports.homePage = (req, res) =>  {
    if (req.session.user){
        // tentar colocar qualquer coisa em locals e ver
        // se passa
        res.render('index');
    }
    else {
        res.render('login'); 
    }
    // res.render('index', {
    //     title: 'This is the <span style="color:#115666;">title</span>',
    //     numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    // }); 
    return;
}

exports.treatPost = (req, res) => {
    res.send(req.body);
    return;
};


