var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('form', {
        name : 'Eunji',
        blog : 'eunzihong.github.io',
        homepage : 'github.io/eunzihong'
    });
});

router.post('/', function(req, res, next){
    res.json(req.body);
});

module.exports = router;