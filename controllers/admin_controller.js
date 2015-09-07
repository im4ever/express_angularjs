/**
 * Created by im4ever on 2015/7/28.
 */
var utility=require('utility');
var BaseController = require('./_base_controller');
var util = require('util');
var photoLogic = require('./../logic/photo_logic');
var customConst = require('./../lib/const');
var videoLogic = require('./../logic/video_logic');
var modelLogic = require('./../logic/model_logic');

function AdminController(req, res){
    BaseController.call(this, req, res);
}

util.inherits(AdminController, BaseController);

/**
 * 后台用登录异常返回
 */
AdminController.prototype.notAllow = function(){
    this.failedResponse(customConst.ERR_NEED_ADMIN);
};

/**
 * 后台用上传图片
 * @param _imageType
 */
AdminController.prototype.uploadPhoto = function(_imageType){
    var instance = this;
    var imageType = this.req.param("imageType");
    if(util.isNullOrUndefined(imageType)){
        imageType = _imageType;
    }
    this.isAdmin().then(
        function(){
            return photoLogic.uploadQiniu(customConst.USER_ADMIN, imageType, true);
        },
        function(){
            this.notAllow();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

/**
 * 后台用上传模型文件
 */
AdminController.prototype.uploadModelFile = function(){
    var instance = this;
    var uid = this.uid;
    var modelName = this.req.param("modelName");
    var actions = this.req.param("actions");
    var parts = this.req.param("parts");
    this.isAdmin().then(
        function(){
            return modelLogic.uploadQiniu(uid, modelName, actions, parts, true);
        },
        function(){
            this.notAllow();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

/**
 * 后台用上传视频
 * @param _imageType
 */
AdminController.prototype.uploadVideo = function(){
    var instance = this;
    var uid=this.uid;
    this.isAdmin().then(
        function(){
            return videoLogic.uploadVideo(uid);
        },
        function(){
            this.notAllow();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};


AdminController.prototype.logout=function(){
    this.req.session.destroy();
    this.res.redirect("/admin/public/login");
};

module.exports = AdminController;