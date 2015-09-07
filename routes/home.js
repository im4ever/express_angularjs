/**
 * Created by qufan on 2015/7/21 0021.
 */

var express = require('express');
var router = express.Router();
var ModelController = require('./../controllers/model_controller');
var ProductController = require('./../controllers/product_controller');
var SystemController=require('./../controllers/system_controller');

router.get('/index', function(req, res, next){
    var modelController = new ModelController(req, res);
    modelController.index();
});

router.get('/recommend', function(req, res, next){
    var modelController = new ModelController(req, res);
    modelController.recommend();
});

router.get('/top', function(req, res, next){
    var systemController = new SystemController(req, res);
    systemController.getTop();
});

//搜索
router.get('/search/:key',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.search();
});

router.get("/scan/:pid", function(req, res){
    var productController =new ProductController(req,res);
    productController.info();
});

router.all('/scan',function(req,res){
    var productController =new ProductController(req,res);
    productController.info();
});

router.get('/more/:tid/:page/:limit',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.more();
});
router.all('/more',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.more();
});
router.get('/getUrl',function(req,res){
    systemController=new SystemController(req,res);
    systemController.getUrl();
});
router.all('/getUrl',function(req,res){
    systemController=new SystemController(req,res);
    systemController.getUrl();
});

router.get('/editUrl/:url',function(req,res){
    systemController=new SystemController(req,res);
    systemController.editUrl();
});
router.all('/editUrl',function(req,res){
    systemController=new SystemController(req,res);
    systemController.editUrl();
});
router.all('/getParts',function(req,res){
    systemController=new SystemController(req,res);
    systemController.getParts();
});
router.all('/addPart',function(req,res){
    systemController=new SystemController(req,res);
    systemController.addPart();
});
module.exports = router;