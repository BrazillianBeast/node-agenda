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

exports.editByIndex = async function(req, res){
    if(!req.params.id) return res.render('404');

    const contact = await Contact.searchById(req.params.id);
    if(!contact)return res.render('404');

    // contact: contact works as the same
    res.render('contact', { contact });
}

exports.edit = async function(req,res){
    try{
        if(!req.params.id) return res.render('404');
        const contact = new Contact(req.body);
        await contact.edit(req.params.id);
    
        if (contact.errors.length > 0){
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect(`/contact/index/${req.params.id}`));
            return;
        }
    
        req.flash('sucess', 'Contact sucessfully updated');
        req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
        return;

    }catch(e){
        console.log(e)
        res.render('404');
    };
};


exports.delete = async function(req, res){
    try{
        if(!req.params.id) return res.render('404');

        const contact = await Contact.delete(req.params.id);
        if(!contact)return res.render('404');

        req.flash('sucess', 'Contact sucessfully deleted');
        req.session.save(() => res.redirect('/'));
        return;

    }catch(e){
        console.log(e)
        res.render('404'); 
    }
};
