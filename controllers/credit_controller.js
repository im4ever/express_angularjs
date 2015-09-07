var util = require('util');
var BaseController = require('./_base_controller');
var creditLogic = require('./../logic/credit_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var CreditController=function(req,res){
    BaseController.call(this, req, res);
};
/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(CreditController, BaseController);

CreditController.prototype.setScore=function(){
    var instance=this;
    var action=this.req.param('action');
    action=eval('('+action+')');
    creditLogic.setScore(action).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err);
    });
};

module.exports = CreditController;