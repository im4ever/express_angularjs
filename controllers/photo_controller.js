/**
 * Created by qufan on 2015/7/15 0015.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var photoLogic = require('./../logic/photo_logic');

function PhotoController(req, res){
    BaseController.call(this, req, res);
}

/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(PhotoController, BaseController);

/**
 * 上传图片
 */
PhotoController.prototype.upload =  function(_imageType){
    var instance = this;
    var uid = this.uid;
    var imageType = this.req.param("imageType");
    if(util.isNullOrUndefined(imageType)){
        imageType = _imageType;
    }
    this._checkToken().then(
        function(){
            return photoLogic.uploadQiniu(uid, imageType);
        },
        function(){
            instance._needLoginResponse();
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
 * 上传至七牛云存储
 * @param _imageType
 */
PhotoController.prototype.uploadQiniu = function(_imageType){
    var instance = this;
    var uid = this.uid;
    var imageType = this.req.param('imageType');
    if(util.isNullOrUndefined(imageType)){
        imageType = _imageType;
    }
    this._checkToken().then(
        function(){
            return photoLogic.upload(uid, imageType);
        },
        function(){
            instance._needLoginResponse();
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

module.exports = PhotoController;

