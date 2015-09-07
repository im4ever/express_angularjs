var express = require('express');
var router = express.Router();
var PushController = require('./../controllers/push_controller');

router.get('/singlePush/:registrationId/:content/:extra',function(req,res){
    var pushController=new PushController(req,res);
    pushController.singlePush();
});
router.get('/allPush',function(req,res){
    var pushController=new PushController(req,res);
    pushController.allPush();
});
router.all('/urlPushToAll',function(req,res){
    var pushController=new PushController(req,res);
    pushController.urlPushToAll();
});
router.get('/modelInfoPushToAll/:content/:mid',function(req,res){
    var pushController=new PushController(req,res);
    pushController.modelInfoPushToAll();
});
router.all('/modelInfoPushToAll',function(req,res){
    var pushController=new PushController(req,res);
    pushController.modelInfoPushToAll();
});

router.all('/urlPushToSingle',function(req,res){
    var pushController=new PushController(req,res);
    pushController.urlPushToSingle();
});
router.get('/modelInfoPushToSingle/:pushID/:content/:mid',function(req,res){
    var pushController=new PushController(req,res);
    pushController.modelInfoPushToSingle();
});
router.all('/modelInfoPushToSingle',function(req,res){
    var pushController=new PushController(req,res);
    pushController.modelInfoPushToSingle();
});


module.exports = router;