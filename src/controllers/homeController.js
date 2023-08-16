const HomeModel = require('../models/HomeModel');

exports.homePage = (req, res) =>  {
    res.render('index', {
        title: 'This is the <span style="color:#115666;">title</span>',
        numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }); 
    return;
}

exports.treatPost = (req, res) => {
    res.send(req.body);
    return;
};


