/**
 * Created by im4ever on 2015/7/13.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var productLogic = require('./../logic/product_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var productController=function(req,res){
    BaseController.call(this, req, res);
};
/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(productController, BaseController);

//获取商品信息
productController.prototype.info=function(){
    var pid=this.req.param('pid');
    var instance=this;
    productLogic.getInfo(pid).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};
//获取首页商品列表
productController.prototype.getProducts=function(){
    var instance=this;
    productLogic.getProducts().then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.res.json(err);
        }
    );
};

productController.prototype.addProduct = function(){
    var instance = this;
    var uid = this.uid;
    var pid = this.req.param("pid");
    this._checkToken().then(
        function(){
            return productLogic.addProduct(uid, pid);
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

module.exports = productController;