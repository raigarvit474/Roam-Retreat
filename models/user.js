const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);//This is used as a plugin because it automatically implements username,hashing,salting and hashpasswords

module.exports = mongoose.model('User', userSchema);