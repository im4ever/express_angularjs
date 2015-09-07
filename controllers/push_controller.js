var util = require('util');
var BaseController = require('./_base_controller');
var pushLogic = require('./../logic/push_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var PushController=function(req,res){
    BaseController.call(this, req, res);
};
/**Ps
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(PushController, BaseController);
//模型跳转
PushController.prototype.modelInfoPushToSingle=function(){
    var instance=this;
    var pushID=this.appInfo.pushID;
    var content=this.req.param('content');
    var mid=this.req.param('mid');
    var type=this.req.param('type')?this.req.param('type'):0;
    pushLogic.modelInfoPushToSingle(pushID,content,mid,type).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
//模型跳转
PushController.prototype.modelInfoPushToAll=function(){
    var instance=this;
    var content=this.req.param('content');
    var mid=this.req.param('mid');
    var type=this.req.param('type')?this.req.param('type'):0;
    pushLogic.modelInfoPushToAll(content,mid,type).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
//url跳转
PushController.prototype.urlPushToSingle=function(){
    var instance=this;
    var pushID=this.appInfo.pushID;
    var content=this.req.param('content');
    var url=this.req.param('url');
    var type=this.req.param('type')?this.req.param('type'):0;
    pushLogic.urlPushToSingle(pushID,content,url,type).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
PushController.prototype.urlPushToAll=function(){
    var instance=this;
    var content=this.req.param('content');
    var url=this.req.param('url');
    var type=this.req.param('type')?this.req.param('type'):0;
    pushLogic.urlPushToAll(content,url,type).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};

//文本s
PushController.prototype.textPushToSingle=function(){
    var instance=this;
    var pushID=this.appInfo.pushID;
    var content=this.req.param('content');
    var type=this.req.param('type')?this.req.param('type'):0;
    pushLogic.textPushToSingle(pushID,content,type).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
PushController.prototype.textPushToAll=function(){
    var instance=this;
    var content=this.req.param('content');
    var type=this.req.param('type')?this.req.param('type'):0;
    pushLogic.textPushToAll(content,type).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
//创建跳转
PushController.prototype.createPushToSingle=function(){
    var instance=this;
    var pushID=this.appInfo.pushID;
    var content=this.req.param('content');
    var type=this.req.param('type')?this.req.param('type'):0;
    pushLogic.createPushToSingle(pushID,content,type).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
PushController.prototype.createPushToAll=function(){
    var instance=this;
    var content=this.req.param('content');
    var type=this.req.param('type')?this.req.param('type'):0;
    pushLogic.createPushToAll(content,type).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};



PushController.prototype.allPush=function(){
    var instance=this;
    var content=this.req.param('content');
    var extra=this.req.param('extra');
    pushLogic.allPush(content,extra).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};

module.exports = PushController;