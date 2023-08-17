const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
    res.render('contact', {
        contact: {}
    });
}

exports.register = async (req,res) => {
    try {
        const contact = new Contact(req.body);
        await contact.register();
    
        if (contact.errors.length > 0){
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect('/contact/index'));
            return;
        }
    
        req.flash('sucess', 'Contact sucessfully registered');
        req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
        return;
    }catch(e){
        console.log(e);
        return res.render('404');
    }
};

exports.editIndex = async function(req, res){
    if(!req.params.id) return res.render('404');

    const contact = await Contact.searchById(req.params.id);
    if(!contact)return res.render('404');

    // contact: contact works as the same
    res.render('contact', { contact });
}