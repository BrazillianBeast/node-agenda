const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telephone: { type: String, required: false, default: '' },
    createdAt: { type: Date, default: Date.now() },
    userOwner: { type: String, required: true, default: ''},
});

const ContactModel = mongoose.model('Contact', ContactSchema);

// This model is created using constructor functions
//  instead of classes both works with JS

function Contact(body, userOwnerUsername){
    this.body = body;
    this.body.userOwner= userOwnerUsername;
    this.errors = [];
    this.contact = null;
}

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
        userOwner: this.body.userOwner,
    };
};

Contact.prototype.edit = async function (id){
    if(typeof id !== 'string') return;
    this.validate();
    if(this.errors.length > 0) return;

    // new will bring the updated contact
    this.contact = await ContactModel.findByIdAndUpdate(id, this.body);
};

//STATIC FUNCTIONS
// Static function, we dont need to have a class created to use this method
Contact.searchById = async function(id){
    if(typeof id !== 'string') return;
    const contact = await ContactModel.findById(id);
    return contact;
};


// 1 Iscreasing order
// -1 Descreasing order
Contact.contactsSearch = async function(userOwner){
    const contacts = await ContactModel.find({ userOwner: userOwner.username })
        .sort({ createdAt: -1 });
    return contacts;
};


Contact.delete = async function(id){
    if(typeof id !== 'string') return;
    const contact = await ContactModel.findOneAndDelete({_id: id});
    return contact;
};

module.exports = Contact;