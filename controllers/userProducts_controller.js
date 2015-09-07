/**
 * Created by im4ever on 2015/7/14.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var userProductsLogic = require('./../logic/user_products_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');

function UserProductsController(req,res){
    BaseController.call(this, req, res);
}
/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(UserProductsController, BaseController);

UserProductsController.prototype.getProducts=function(){
    var instance=this;
    var uid = this.uid;
    this._checkToken().then(
        function(){
            return userProductsLogic.getProducts(uid);
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

module.exports = UserProductsController;