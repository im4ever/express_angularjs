/**
 * Created by qufan on 2015/7/11 0011.
 */
var util = require('util');
var config  = require('./../config/config').controller;
var customUtils = require('./../lib/customUtils');
var userModel = require('./../models/user_model'),
    Q = require('q');
var customConst = require('./../lib/const');

/**
 * 构造函数
 * @param req
 * @param res
 * @constructor
 */
function BaseController(req, res){
    this.req = req;
    this.res = res;
    var tokenSession = customUtils.getClientInfo(req);
    this.uid = tokenSession.uid;
    this.token = tokenSession.token;
    this.appInfo = customUtils.getAppInfo(req);
    if(config.record_request){
        customUtils.logRequest(req);
    }
}



BaseController.prototype._response = function(data){
    code = arguments[1]?arguments[1]:200;
    this.res.status(code).json(data);
};

BaseController.prototype.customResponse = function(/* data, success, message */){
    var data =  arguments[0] ? arguments[0]: {};
    var success = arguments[1];
    success = util.isNullOrUndefined(success)  ? true: success;

    var message = arguments[2] ?  arguments[2] : null;
    if(success){
        if(data === true){
            data = {};
        }
        if(!util.isNullOrUndefined(message)){
            data.message = message;
        }
        data.status = 0;
        this._response(data);
    }else{
        this._response(data);
    }
};

BaseController.prototype.failedResponse = function(errcode){
    console.log(errcode);
    var msg = arguments[1]|| null;
    var extra = arguments[2]||{};
    var data = {'status':errcode};
    data.message = msg;
    data = util._extend(data, extra);
    this.customResponse(data, false);
};

/**
 * ��֤�û�token���¼
 * @returns {deferred.promise|{then, catch, finally}}
 * @private
 */
BaseController.prototype._checkToken = function(){
    var deferred = Q.defer();
    if(this.uid == customConst.INVALID_UID || this.token == customConst.INVALID_TOKEN ){
        deferred.reject();
    }else{
        if(config.check_token ){
            userModel.findOne({
                where:{
                    uid:this.uid,
                    token:this.token
                }
            }).then(
                function(data){
                    deferred.resolve(data);
                },
                function(err){
                    deferred.reject(err);
                }
            );
        }else{
            deferred.resolve();
        }
    }
    return deferred.promise;
};

BaseController.prototype.isAdmin = function(){
    var deferred = Q.defer();
    var uid = this.req.query.uid;
    deferred.resolve();
    //if(uid == customConst.USER_ADMIN){
    //    deferred.resolve();
    //}else{
    //    deferred.reject();
    //}
    return deferred.promise;
};

BaseController.prototype._needLoginResponse = function(){
    this.failedResponse(customConst.ERR_NEED_LOGIN);
};

module.exports = BaseController;