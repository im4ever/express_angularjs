/**
 * Created by im4ever on 2015/7/17.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var partLogic = require('./../logic/part_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var partController=function(req,res){
    BaseController.call(this, req, res);
};
/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(partController, BaseController);

//获取商品信息
partController.prototype.getMyParts=function(){
    var instance=this;
    var uid = this.uid;
    this._checkToken().then(
        function(){
            return partLogic.getMyParts(uid);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

//编辑我的商品信息
partController.prototype.edit=function(){
    var instance=this;
    var uid = this.uid;
    var records=this.req.param('parts');
    this._checkToken().then(
        function(){
            return partLogic.edit(records,uid);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};
module.exports=partController;