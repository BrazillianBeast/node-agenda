const Contact = require('../models/ContactModel');

exports.homePage = async(req, res) =>  {
    if (req.session.user){
        const contacts = await Contact.contactsSearch(req.session.user);
        res.render('index', { contacts });
    }
    else {
        res.render('login'); 
    }
    return;
}




