const mongoose = require('mongoose');

const { Schema } = mongoose;

/*
    Account Schema
*/

const MessageSchema = new Schema({
    id: String,
    threadId: String,
    snippet: String,
    historyId: String,
    date: String
});

MessageSchema.statics.getMessage = function(){
	return this.find();
}

MessageSchema.statics.saveMessage = function(id, threadId, snippet, historyId, date){
    return this.create({ id, threadId, snippet, historyId, date });
}

MessageSchema.statics.removeAll = function(){
    return this.deleteMany();
}
var Message =  mongoose.model('MessageSchema', MessageSchema);

module.exports = Message;