/* 
 * mongo.js 
 * set mongodb data
 * no page layout -> page connection : 404 NOT FOUND
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("mongo db connection OK.");         // connection check done
});

var testSchema = mongoose.Schema({      // DTO - Class in Java : Contact
    name: String
});

testSchema.methods.speak = function () {    // Schema(Class) method setting
    var greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name"
    console.log("speak() - " + greeting);
}

var TestModel = mongoose.model("TestModel", testSchema);    // Object in Java

var testIns = new TestModel({ name: "testIns"});

testIns.save(function(err, testIns){
    if(err) return console.error(err);
    testIns.speak();
});

TestModel.find(function(err, models){
    if(err) return console.error(err);
    console.log("find() - "+models);
});

TestModel.find({name:/^testIns/});
module.exports = router;

// on console, 
// find() : first
// speak() Meow : later