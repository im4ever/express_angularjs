/**
 * Created by XPS 12 on 2015/8/22.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var accountLogic = require('./../logic/account_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var testController=function(req,res){
    BaseController.call(this, req, res);
};
/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(testController, BaseController);

testController.prototype.signin=function(){
    var email = this.req.param('email');
    var password = this.req.param('password');
    var appInfo = customUtils.getAppInfo(this.req);
    var instance = this;
    accountLogic.signinFlow(email, password, appInfo).then(
        function(data){
            console.log(data);
            instance.customResponse({data:data} );
        },
        function(err){
            console.log(err);
            console.log("id:" + err.errno);
            console.log(err.message);
            console.dir(err);
            instance.customResponse({data:err} );

            //instance.failedResponse(5);
            //instance.res.json(err);
        }
    );
};

testController.prototype.login = function(){
    var instance =this;
    this._checkToken().then(
        function(){
            instance.customResponse({data:{}});
        },
        function(){
            instance._needLoginResponse();
        }
    )
};

testController.prototype.signin3rd = function(){
    var openid = this.req.param('openid');
    var type = this.req.param('type');
    var accessToken = this.req.param('accessToken');
    var expiresIn = this.req.param('expiresIn');
    var nickname = this.req.param('nickname');
    var avatar = this.req.param('avatar');
    var gender = this.req.param('gender');
    var appInfo = customUtils.getAppInfo(this.req);

    console.log(openid);
    console.log(type);
    console.log(accessToken);
    console.log(expiresIn);
    console.log(nickname);
    console.log(avatar);
    console.log(appInfo);
    //instanceof
    var instance = this;
    //instance.customResponse({data:{}});
    //
    accountLogic.signinFrom3rdFlow(openid, type, accessToken, expiresIn, nickname, avatar,gender, appInfo).then(
        function(data){
            console.log(data);
            instance.customResponse({data:data} );
        },
        function(err){
            instance.customResponse({data:err} );
        }
    );
}
module.exports = testController;