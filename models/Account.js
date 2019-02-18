const mongoose = require('mongoose');

const { Schema } = mongoose;

/*
     Account Schema
*/

const UserSchema = new Schema({
    id: String,
    token: String,
    name: String,
    email: String
});

UserSchema.statics.getAccount = function(){
	return this.find();
}
var User =  mongoose.model('UserSchema', UserSchema);

module.exports = User;