/**
 * Created by im4ever on 2015/7/13.
 */
var express = require('express');
var router = express.Router();
var ModelController = require('./../controllers/model_controller');
var VideoController = require('./../controllers/video_controller');
var customConst = require('./../lib/const');
var PhotoController = require('./../controllers/photo_controller');

/**
 * 查询某个模型的详细信息
 */
router.all('/info', function(req, res){
    modelController =new ModelController(req,res);
    modelController.info();
});


/**
 * 扫描某个模型的信息
 */
router.all('/scan', function(req, res){
    var modelController = new ModelController(req, res);
    modelController.scan();
});

//获取我上传的模型
router.all('/my',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.getMyModels();
});
//获取我下载的模型
router.all('/download',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.getModelsForDownload();
});

/**
 * 开始下载模型
 */
router.get('/doDownload/:mid',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.doDownload();
});
router.all('/doDownload',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.doDownload();
});

//搜索
router.get('/search/:key',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.search();
});
//最新模型
router.get('/new/:page',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.getModelsForNew();
});
//最高分模型
router.get('/score',function(req,res){
    var modelController = new ModelController(req,res);
    modelController.getModelsForScore();
});

/**
 * 上传模型文件
 */
router.all('/upload', function(req, res,next){
    var modelController = new ModelController(req, res);
    modelController.upload();
});
//评论
router.get('/comment/:mid/:content',function(req,res,next){
    var modelController = new ModelController(req, res);
    modelController.comment();
});
router.all('/comment',function(req,res,next){
    var modelController = new ModelController(req, res);
    modelController.comment();
});
//评分
router.get('/score/:mid/:score',function(req,res,next){
    var modelController = new ModelController(req, res);
    modelController.score();
});
router.all('/score',function(req,res,next){
    var modelController = new ModelController(req, res);
    modelController.score();
});

//获取评论 支持分页
router.get('/getComments/:mid/:page/:limit',function(req,res,next){
    var modelController = new ModelController(req, res);
    modelController.getComments();
});
router.all('/getComments',function(req,res,next){
    var modelController = new ModelController(req, res);
    modelController.getComments();
});

/**
 * 模型视频上传
 */
router.all('/videos/upload', function(req, res, next){
    var videoController = new VideoController(req, res);
    videoController.uploadQiniu();
});


/**
 * 模型上传图片
 */
router.all('/photos', function (req, res, next) {
    var photoController = new PhotoController(req, res);
    photoController.uploadQiniu(customConst.IMAGE_TYPE_MODEL);
});

/**
 * 模型发布
 */
router.all("/publish", function(req, res){
    var modelController = new ModelController(req, res);
    modelController.publish();
});
router.all("/myComments",function(req,res){
    var modelController = new ModelController(req, res);
    modelController.myComments();
});
module.exports = router;
