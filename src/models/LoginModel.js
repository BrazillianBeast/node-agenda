const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // confirmationPassword: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    
    async login(){
        this.validateLogin();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user){
            this.errors.push('Invalid user or password');
            return;
            }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Invalid user or password');
            this.user = null;
            return;
        }

    }

    async register() {
        this.validate();
        if(this.errors.length > 0) return;

        await this.emailExists();
        await this.usernameExists();

        if(this.errors.length > 0) return;


        // delete this.body.confirmationPassword;
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        try{
            this.user = await LoginModel.create(this.body);
        } catch(e){
            console.log(e);
        }
    }

    async emailExists() {
        const user = await LoginModel.findOne({ email: this.body.email });

        if(user) this.errors.push('Email is already in use');
    }

    async usernameExists() {
        const user = await LoginModel.findOne({ username: this.body.username });

        if(user) this.errors.push('Username is already in use');
    }

    validate(){
        this.cleanUp();
        // Validation
        // The email needs to be valid
        if(!validator.isEmail(this.body.email)) this.errors.push('Invalid email');

        if(!this.body.email) this.errors.push('Email is required');

        if(!this.body.username) this.errors.push('Username is required');
        
        // Password needs to have between 3 to 50 characters
        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push('The password must be between 3 and 50 characters')
        }

        if(this.body.confirmationPassword !== this.body.password){
            this.errors.push(`The password confirmation does not match the password`);
            console.log(this.body);
        }
    }

    validateLogin() {
        this.cleanUp();
        if(!validator.isEmail(this.body.email)) this.errors.push('Invalid email');
        
        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push('The password must be between 3 and 50 characters')
        }
    }

    cleanUp(){
        for(const key in this.body){
            if (typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            username: this.body.username,
            email: this.body.email,
            password: this.body.password,
            confirmationPassword: this.body.confirmationPassword
        };
    }
}

module.exports = Login;