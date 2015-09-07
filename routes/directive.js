/**
 * Created by im4ever on 2015/7/14.
 */
var express = require('express');
var router = express.Router();
var DirectiveController = require('./../controllers/directive_controller');
router.get('/info/:mid',function(req,res){
    var directiveController =new DirectiveController(req,res);
    directiveController.info();
});

module.exports = router;