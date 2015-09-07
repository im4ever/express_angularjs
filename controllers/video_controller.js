/**
 * Created by qufan on 2015/7/27 0027.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var videoLogic = require('./../logic/video_logic');

function VideoController(req, res){
    BaseController.call(this,req, res);
}

/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(VideoController, BaseController);

//上传七牛
VideoController.prototype.uploadQiniu = function(){
    var instance = this;
    var uid = this.uid;
    this._checkToken().then(
        function(){
            return videoLogic.uploadVideo(uid);
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
    )

};

//VideoController.prototype.uploadForModel = function(){
//
//    var uid = customUtil.getUid(this.req);
//    if(uid){
//        var videoType =this.req.param('videoType');
//        var record = {
//            ccVideoid:this.req.param('ccVideoid'),
//            description:this.req.param('description'),
//            //purl:this.req.param(purl),
//            //mid:this.req.param(mid),
//            status:0,
//            ctime:utility.timestamp()
//        };
//
//        var instance = this;
//        videoModel.create(record).then(
//          function(data){
//              if(util.isNullOrUndefined(data)){
//                  var result = customUtil.makeError(customConst.ERR_DB, '视频上传失败');
//                  instance.failedResponse(result.status, result.message);
//              }else{
//                  var dataResult = {vid: data.dataValues.vid};
//                  instance.customResponse({data:dataResult});
//              }
//          }  ,
//            function(){
//                var result = customUtil.makeError(customConst.ERR_DB, '视频上传失败');
//                instance.failedResponse(result.status, result.message);
//            }
//        );
//    }else{
//        this.failedResponse(customConst.ERR_NEED_UID, '需要uid');
//    }
//};

module.exports = VideoController;