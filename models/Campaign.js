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

CampaignSchema.statics.getInbox = function(){
	return this.find();
}

CampaignSchema.statics.saveInbox = function(user, namefrom, emailaddressfrom, to, subject, text){
    return this.create({ user, namefrom, emailaddressfrom, to, subject, text });
}

var Campaign =  mongoose.model('CampaignSchema', CampaignSchema);

module.exports = Campaign;