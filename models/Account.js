const mongoose = require('mongoose');

const { Schema } = mongoose;

/*
     Account Schema
*/

const AccountSchema = new Schema({
    id: String,
    token: String,
    name: String,
    email: String
});

var Account =  mongoose.model('AccountSchema', AccountSchema);

module.exports = Account;