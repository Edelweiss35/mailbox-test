const mongoose = require('mongoose');

const { Schema } = mongoose;

/*
    Sheet Schema
*/
const SheetSchema = new Schema({
    Send: Boolean,
    Status: String,
    Called: Boolean,
    Company: String,
    Address1 : String,
    Address2 : String,
    ZIPCode : String,
    City : String,
    Region: String,
    Country: String,
    Phone: String,
    Contact: String,
    Website: String,
    Responsive: String,
    GoogleRank: String,
    MapRank: String,
    Query: String,
    Email :  String,
    Mail: String,
    GoogleRank: String,
    MapRank: String,
    Query: String,
    Facebook: String,
    Twitter: String,
    GooglePlus: String,
    Linkedin: String,
    Instagram: String,
    Youtube: String,
    Facebook: String,
    Keyword: String,
    SSCaptured: Boolean,
    SS404: Boolean,
    Delete: Boolean
});

SheetSchema.statics.getMapRank = async function( idAry){
    var res = [];
    for( var i in idAry ){
        var _id = idAry[i]._id;
        var rowIdx = idAry[i].rowIdx;
        var data = await this.findOne({_id});
        var MapRank = data.MapRank;
        res.push({rowIdx, MapRank});
    }
    return res;
}

SheetSchema.statics.getGoogleRank = async function( idAry){
    var res = [];
    for( var i in idAry ){
        var _id = idAry[i]._id;
        var rowIdx = idAry[i].rowIdx;
        var data = await this.findOne({_id});
        var Query = data.Query;
        var GoogleRank = data.GoogleRank;
        res.push({rowIdx, GoogleRank, Query});
    }
    return res;
}

SheetSchema.statics.getSSStatus = async function( idAry){
    var res = [];
    for( var i in idAry ){
        var _id = idAry[i]._id;
        var rowIdx = idAry[i].rowIdx;
        var data = await this.findOne({_id});
        var SS404 = data.SS404;
        var SSCaptured = data.SSCaptured;
        res.push({rowIdx, SSCaptured, SS404});
    }
    return res;
}

SheetSchema.statics.saveSelectStatus = async function( idAry, checked){
    // await this.updateMany({'Send': true}, {$set: {'Send':false}});
    for( var i in idAry ){
        var _id = idAry[i];
        await this.updateOne({_id}, {$set:{'Send': checked}});
    }
    return;
}

SheetSchema.statics.saveSelectStatus = async function( idAry, checked){
    // await this.updateMany({'Send': true}, {$set: {'Send':false}});
    for( var i in idAry ){
        var _id = idAry[i];
        await this.updateOne({_id}, {$set:{'Send': checked}});
    }
    return;
}
SheetSchema.statics.saveDelStatus = async function( idAry){
    // await this.updateMany({'Delete': true}, {$set: {'Delete':false}});
    for( var i in idAry ){
        var _id = idAry[i];
        await this.updateOne({_id}, {$set:{'Delete': true}});
    }
    return;
}
SheetSchema.statics.getSSEmptySheet = function(){
    return this.findOne({SSCaptured: false});
}
SheetSchema.statics.getGoogleUnRankedSheet = function(){
    return this.findOne({GoogleRank: '0'});
}
SheetSchema.statics.getMapUnRankedSheet = function(){
    return this.findOne({MapRank: '0'});
}
SheetSchema.statics.updateData = function(_id, index, data){
    const key = `${index}`;
    return this.updateOne({ _id }, {$set: { [key]:data }});
}
SheetSchema.statics.getSheets = function(){
    return this.find();
}
SheetSchema.statics.removeAll = function(){
    return this.deleteMany();
}
SheetSchema.statics.saveSheet = function(Company, Address1, Address2, ZIPCode, City, Region, Country, Phone, Contact, Website, Responsive, Email, Facebook, Twitter, GooglePlus, Linkedin, Instagram, Youtube, Facebook, Keyword){
    return this.create({ Company, Address1, Address2, ZIPCode, City, Region, Country, Phone, Contact, Website, Responsive, Email, Facebook, Twitter, GooglePlus, Linkedin, Instagram, Youtube, Facebook, Keyword, 'GoogleRank': '0', 'MapRank': '0', 'Query':'-', 'SSCaptured': false, 'Send': false, 'Delete': false, 'SS404': false, 'Status': 'NEW', 'Mail':'None', 'Called': false});
}

var Sheet =  mongoose.model('SheetSchema', SheetSchema);
module.exports = Sheet;