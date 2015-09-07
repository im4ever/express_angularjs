var util = require('util');
var BaseController = require('./_base_controller'),
    modelLogic = require('./../logic/model_logic');
var systemLogic = require('./../logic/system_logic');
var adminLogic = require('./../logic/admin_user_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var SystemController=function(req,res){
    BaseController.call(this, req, res);
};
/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(SystemController, BaseController);

SystemController.prototype.getUrl=function(){
    var instance=this;
    systemLogic.getUrl().then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};

SystemController.prototype.editUrl=function(){
    var instance=this;
    var url=this.req.param('url');
    systemLogic.editUrl(url).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
SystemController.prototype.getParts=function(){
    var instance=this;
    systemLogic.getParts().then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
SystemController.prototype.addPart=function(){
    var instance=this;
    var pname=this.req.param('pname');
    var description=this.req.param('description');
    systemLogic.addPart(pname,description).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};
//首页顶部资源获取
SystemController.prototype.getTop = function(){
    var instance=this;
    modelLogic.getTop().then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
        }
    )
};

//首页顶部资源获取
SystemController.prototype.deleteTop = function(){
    var instance=this;
    var id=this.req.param('id');
    modelLogic.deleteTop(id).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
        }
    )
};

SystemController.prototype.adminUser = function(){
    var instance=this;
    var username=this.req.param('username');
    var password=this.req.param('password');
    adminLogic.checkUser(username,password).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
        }
    )
};

SystemController.prototype.getGroup = function(){
    var instance=this;
    var uid=this.req.param('uid');
    adminLogic.getGroup(uid).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
        }
    )
};
SystemController.prototype.getRules = function(){
    var instance=this;
    var rules=this.req.param('rules');
    adminLogic.getRules(rules).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
        }
    )
};

module.exports=SystemController;