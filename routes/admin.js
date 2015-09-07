/**
 * Created by im4ever on 2015/7/28.
 */
var express = require('express');
var router = express.Router();
var AccountController = require('./../controllers/account_controller');
var ModelController = require('./../controllers/model_controller');
var PushController = require('./../controllers/push_controller');
var CreditController = require('./../controllers/credit_controller');
var AdminController = require('./../controllers/admin_controller');
var SystemController = require('./../controllers/system_controller');
var customConst = require('./../lib/const');
router.get('/',function(req,res){
        res.sendfile('app/index.html');
});
router.get('/getAllUsers/:where/:page',function(req,res){
    var accountController = new AccountController(req,res);
    accountController.getAllUsers();
});
router.get('/getUserInfo/:uid',function(req,res){
   var accountController = new AccountController(req,res);
    accountController.getUserInfo();
});
router.get('/getAllModels/:where/:order/:page',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.getAllModels();
});
router.all('/getAllModels',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.getAllModels();
});
router.get('/getModelInfo/:mid',function(req,res){
    var modelController =new ModelController(req,res);
    modelController.info();
});
router.all('/checkModel',function(req,res){
    var modelController =new ModelController(req,res);
    modelController.checkModel();
});
router.all('/setPraise',function(req,res){
    var modelController =new ModelController(req,res);
    modelController.setPraise();
});
router.get('/getTypeInfo',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.getTypeInfo();
});
router.all('/singlePush',function(req,res){
    var pushController = new PushController(req,res);
    pushController.singlePush();
});
router.all('/allPush',function(req,res){
    var pushController = new PushController(req,res);
    pushController.allPush();
});
router.all('/setScore',function(req,res){
    var creditController=new CreditController(req,res);
    creditController.setScore();
});

router.all("/upload/video", function(req, res){
    var adminController=new AdminController(req,res);
    adminController.uploadVideo();
});

router.all("/upload/modelFile", function(req, res){
    var adminController=new AdminController(req,res);
    adminController.uploadModelFile();
});

router.all("/upload/modelPhoto", function(req, res){
    var adminController=new AdminController(req,res);
    adminController.uploadPhoto(customConst.IMAGE_TYPE_MODEL);
});

router.get('/top', function(req, res, next){
    var systemController = new SystemController(req, res);
    systemController.getTop();
});

router.all('/deleteTop',function(req,res){
    var systemController = new SystemController(req, res);
    systemController.deleteTop();
});

router.all('/adminUser',function(req,res){
    var systemController = new SystemController(req, res);
    systemController.adminUser();
});

router.get('/adminUser/:username/:password',function(req,res){
    var systemController = new SystemController(req, res);
    systemController.adminUser();
});
router.get('/getGroup/:uid',function(req,res){
    var systemController = new SystemController(req, res);
    systemController.getGroup();
});
router.all('/getRules',function(req,res){
    var systemController = new SystemController(req, res);
    systemController.getRules();
});
router.get('/getRules/:rules',function(req,res){
    var systemController = new SystemController(req, res);
    systemController.getRules();
});

module.exports = router;