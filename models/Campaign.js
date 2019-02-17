const mongoose = require('mongoose');

const { Schema } = mongoose;

/*
    Campaign Schema
*/

const CampaignSchema = new Schema({
    user: String,
    namefrom: String,
    emailaddressfrom: String,
    to: String,
    subject: String,
    text: String
});

var Campaign =  mongoose.model('CampaignSchema', CampaignSchema);

module.exports = Campaign;