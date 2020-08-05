var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
    name: { type: String, required: true},
    phoneNumber: { type: String, required: true},
    image: String
});

var userSchema = new Schema({
    uid: { type: String, unique: true, required: true },
    name: { type: String },
    email: String,
    contacts: [contactSchema],
    images: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);
