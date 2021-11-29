var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('../views/mind.ejs');
});

module.exports = router;