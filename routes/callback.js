/**
 * Created by qufan on 2015/7/15 0015.
 * 所有的 回调路由
 */
var express = require('express');
var router = express.Router();
var CallbackController = require('./../controllers/callback_controller');
var qiniu = require('./../lib/qiniu_client');


router.all('/photos', function(req, res, next){
    var callbackController = new CallbackController(req, res);
    callbackController.kingshanPhoto();
});

router.all('/videos', function(req, res, next){
    var callbackController = new CallbackController(req, res);
    callbackController.ccVideo();
});
//七牛转码回调
router.all('/presistent',function(req,res,next){
    var callbackController = new CallbackController(req, res);
    callbackController.presistent();
});
router.all('/getUploadToken',function(req,res){
    var data ={'uptoken': qiniu.getUpToken()};
    res.json({status:0,data:data});
});

router.all('/qiniu_photo', function(req, res){
    var callbackController = new CallbackController(req, res);
    callbackController.qiniuPhoto();
});

router.get('/qiniu_video/:vid/:key', function(req, res){
    var callbackController = new CallbackController(req, res);
    callbackController.qiniuVideo();
});

router.all('/qiniu_video', function(req, res){
    var callbackController = new CallbackController(req, res);
    callbackController.qiniuVideo();
});

router.all('/qiniu_video_persistent', function(req, res){
    var callbackController = new CallbackController(req, res);
    callbackController.qiniuVideoPersistent();
});

router.all('/qiniu_modelFile', function(req, res){
    var callbackController = new CallbackController(req, res);
    callbackController.qiniuModelFile();

});

//后台官方上传回调
router.all('/qiniu_media',function(req,res){
    var callbackController = new CallbackController(req, res);
    callbackController.qiniuModelMedia();
});

//后台官方banner
router.all('/qiniu_banner',function(req,res){
    var callbackController = new CallbackController(req, res);
    callbackController.qiniuBanner();
});

module.exports = router;