/**
 * Created by im4ever on 2015/7/14.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var directiveLogic = require('./../logic/directive_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var directiveController=function(req,res){
    BaseController.call(this, req, res);
};
/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(directiveController, BaseController);


directiveController.prototype.info=function(){
    var mid=this.req.param('mid');
    var instance=this;
    directiveLogic.getDirectives(mid).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.res.json(err);
        }
    );
};

module.exports = directiveController;