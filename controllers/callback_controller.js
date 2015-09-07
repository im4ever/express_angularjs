/**
 * Created by qufan on 2015/7/15 0015.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var config = require('./../config/config');
var photoLogic = require('./../logic/photo_logic');
var utility = require('utility');
var qiniuClient = require('./../lib/qiniu_client');
var videoLogic = require('./../logic/video_logic');
var modelLogic = require('./../logic/model_logic');

function CallbackController(req, res) {
    BaseController.call(this, req, res);
}

/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(CallbackController, BaseController);

/**
 * 七牛图片上传回调
 */
CallbackController.prototype.qiniuPhoto = function(){
    var instance = this;
    var key = this.req.param('key');
    var pid = this.req.param('pid');
    var url = qiniuClient.getFileUrl(key);
    var data = {pid:pid, url:url};
    photoLogic.callback(pid, url).then(
        function(){
            instance.customResponse({data:data});
            //this.res.json({pid:pid, url:url, imageType:imageType, success:true});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
            //this.res.json({pid:pid, url:url, imageType:imageType, success:false});
        }
    );
};

/**
 * 七牛视频上传回调
 */
CallbackController.prototype.qiniuVideo = function(){
    var instance = this;
    var key = this.req.param('key');
    var vid = this.req.param('vid');
    var url = qiniuClient.getFileUrl(key);
    //var data = {vid:vid, url:url};
    videoLogic.callback(vid, url).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

/**
 * 视频文件转码回调
 */
CallbackController.prototype.qiniuVideoPersistent = function(){
    var instance = this;
    var key = this.req.param('key');
    var vid = this.req.param('vid');
    var url = qiniuClient.getFileUrl(key);
    var data = {vid:vid, url:url};
    videoLogic.persistentCallback(vid, url).then(
        function(){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

/**
 * 模型文件上传回调
 */
CallbackController.prototype.qiniuModelFile = function(){
    var instance = this;
    var key = this.req.param("key");
    var mfid = this.req.param("mfid");
    var url = qiniuClient.getFileUrl(key);
    var data = {mfid:mfid, url:url};
    modelLogic.callback(mfid, url).then(
        function(){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};
//后台回调
CallbackController.prototype.qiniuModelMedia = function(){
    var instance = this;
    var mid = this.req.param("mid");
    var purl = this.req.param("purl");
    var mediaType = this.req.param("mediaType");
    var videoUrl = this.req.param("videoUrl");
    var ctime=customUtils.now();
    var record={mid:mid,purl:purl,mediaType:mediaType,videoUrl:videoUrl,ctime:ctime};
    modelLogic.adminCallback(record).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};
//后台回调
CallbackController.prototype.qiniuBanner = function(){
    var instance = this;
    var purl = this.req.param("purl");
    var mediaType = this.req.param("mediaType");
    var videoUrl = this.req.param("videoUrl");
    var ctime=customUtils.now();
    var record={purl:purl,mediaType:mediaType,videoUrl:videoUrl,ctime:ctime};
    modelLogic.adminBanner(record).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

module.exports = CallbackController;