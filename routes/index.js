const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
// const upload = multer({dest: 'images/'}) //dest : 저장 위치
const path = require('path');
const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'images/');
      },
      filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
      }
    }),
  });
const PythonShell = require('python-shell');


router.post('/api/register', function(req, res){
    console.log('/register');
    User.findOne({ uid: req.body.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(user) return res.status(400).json({ message: 'already registered'});
        const new_user = new User(req.body);
        new_user.save();
        res.json({});
    });
});

router.post('/api/contacts/post/:uid', function(req, res){
    console.log('/contacts/post');
    User.findOne({ uid: req.params.uid}, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        user.contacts.push(req.body);
        user.save();
        res.json(req.body);
        console.log('post contact done');
    });
});

router.post('/api/images/post/:uid', upload.single('image'),(req,res)=>{
    console.log('post image');
    var image = req.file;
    User.findOne({uid:req.params.uid}, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        user.images.push(req.file.filename);
        user.save();
        res.json('success');
        console.log(req.file.filename);
        console.log('user image list updated');
    });
});

router.get('/api/images/delete/:uid/:filename', function(req, res){
    console.log('delete image');
    console.log(req.params.uid);
    console.log(req.params.filename);
    console.log(__dirname);

    var uid = req.params.uid;
    var filename = req.params.filename;

    User.findOne({uid:uid}, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        user.images.pull(filename);
        user.save();
        console.log('image name unlinked from user image list');
        fs.unlink(path.join(__dirname, '..', 'images', filename), (err)=>{
            if(err) return res.status(500).json({error:err});
            console.log("image file delete");
            res.json('Ok, Thank you!');
        });
    });
    
});



router.get('/api/login/:uid', function(req, res){
    console.log('/login');
    User.findOne({uid: req.params.uid}, function(err, user){
        console.log(req.params.uid);
        if(err) return res.status(500).json({error: err}); 
        if(!user) {
            console.log("no user data");
            return res.status(400).json({message: 'not registered yet'})};
        res.json("login success");
        console.log('login success');
    });
});

router.get('/api/contacts/:uid', function(req, res){
    console.log('/contacts');
    User.findOne({ uid: req.params.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        res.json(user.contacts);
    });
});

router.get('/api/images/:uid', function(req, res){
    console.log('/images');
    User.findOne({ uid: req.params.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        res.json(user.images);
        console.log(user.images);
        console.log('imagessssssss');
    });
})

router.get('/api/users', function(req, res){
    console.log('/users');
    User.find(function(err, users){
        if(err) return res.status(500).json({error: err});
        res.json(users);
        console.log("users:"+json(users));
    })
});

router.get('/api/images/get/:filename', function(req, res){
    console.log('image load');
    var filename =  req.params.filename;
    res.sendFile(path.join(__dirname, '..', 'images', filename));
    console.log('image send');
});

router.post('/api/images/post/:uid', upload.single('image'),(req,res)=>{
    console.log('post image');
    var image = req.file;
    User.findOne({uid:req.params.uid}, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        user.images.push(req.file.filename);
        user.save();
        res.json('success');
        console.log(req.file.filename);
        console.log('user image list updated');
    });
});



router.post('/api/torch/inference/:path', upload.single("image"),(req,res)=>{
    console.log('/torch/inference');
    var image = req.file;
    console.log(req.file.filename);
    console.log(__dirname);

    infpyshell = new PythonShell.PythonShell(path.join(__dirname, '..', 'torch', 'inference.py'), {pythonOptions: ['-u']});

    infpyshell.send(path.join(__dirname, '..', 'images', req.file.filename));

    infpyshell.on("message", result =>{
        // if(err){
        //     res.status(500).json({error: err});
        //     console.log('error occured after run ');
        //     console.log(err);
        // }
        console.log(result);
        res.json(result);
    });

    infpyshell.end(err => {
        if(err){
            res.status(500).json({error: err});
            console.log('error occured');
            console.log(err);
        }
    });

});


module.exports = router;