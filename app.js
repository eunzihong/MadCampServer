var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
const user = require('./models/user');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/madcamp2');

// Model
// var User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var port = process.env.PORT || 80;

app.use('/', require('./routes'));
app.use(express.static('uploads'));


var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
   });