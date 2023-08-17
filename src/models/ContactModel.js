const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telephone: { type: String, required: false, default: '' },
    createAt: { type: Date, default: Date.now() }
});

const ContactModel = mongoose.model('Contact', ContactSchema);

// This model is created using constructor functions
//  instead of classes both works with JS

function Contact(body){
    this.body = body;
    this.errors = [];
    this.contact = null;
}

// Static function, we dont need to have a class created to use this method
Contact.searchById = async function(id){
    if(typeof id !== 'string') return;
    const user = await ContactModel.findById(id);
    return user;
};

Contact.prototype.register = async function(){
    this.validate();
    if(this.errors.length > 0) return;
    this.contact = await ContactModel.create(this.body);


};

Contact.prototype.validate = function() {
    this.cleanUp();
    // Validation
    // The email needs to be valid
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Invalid email');
    if(!this.body.name) this.errors.push('Name is required');
    if(!this.body.email && !this.body.telephone){
        this.errors.push('At least one contact or email must be provided');
    };
}

Contact.prototype.cleanUp = function () {
        for(const key in this.body){
            if (typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

    this.body = {
        name: this.body.name,
        lastName: this.body.lastName,
        email: this.body.email,
        telephone: this.body.telephone,
    };
};

module.exports = Contact;