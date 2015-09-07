/**
 * Created by qufan on 2015/7/11 0011.
 */
var util = require('util');
var config = require('./../config/config');
var utility = require('utility');
var logRequestModel = require('./../models/log_request_model');
var customConst = require('./const');

/**
 * 从请求头中获得用户的客户端信息
 * @param req
 * @returns {{}|*}
 */
exports.getAppInfo = function(req){
    var appAgent = req.headers['app-agent'];
    appInfo = {
        //name:"",
        platform:"",
        version:"",
        versionNum:"",
        channel:"",
        deviceID:"",
        pushID:"",
        loginIP:""
    };
    if(appAgent != null){
        var appArr = appAgent.split('/');
        if(appArr.length >= 8){
            appInfo = {
                //name:appArr[0],
                platform:appArr[1],
                version:appArr[2],
                versionNum:appArr[3],
                channel:appArr[4],
                deviceID:appArr[5],
                pushID:appArr[6],
                loginIP:appArr[7]
            };
        }
    }
    return appInfo;
};

/**
 * 从请求头中获得用户信息
 * @param req
 * @returns {*}
 */
exports.getClientInfo = function(req /*, isGet = true*/){
    var uid, token,registrationID;
    uid = req.param('uid');
    token = req.param('token');
    if(util.isNullOrUndefined(uid)){
        var auth =  req.headers['auth'];
        if(util.isNullOrUndefined(auth)){
            return {
                uid:customConst.INVALID_UID,
                token:customConst.INVALID_TOKEN
            };
        }else{
            var authArr = auth.split('/');
            return {
                uid:authArr[0],
                token:authArr[1],
                registrationID:authArr[2]
            };
        }
    }else{
        return {uid:uid,token:token,registrationID:registrationID};
    }
};

/**
 * 从请求头中解析uid
 * @param req
 * @returns {*}
 */
exports.getUid = function(req){
    var clientInfo = this.getClientInfo(req);
    if(clientInfo !== false){
        return clientInfo['uid'];
    }else{
        return false;
    }
};


var response= function(res, data){
    var code = arguments[2]?arguments[2]:200;
    res.status(code).json(data);
};

/**
 * 生成错误返回的对象
 * @param errcode
 * @returns {{status: *}}
 */
exports.makeError = function(errcode){
    var msg = arguments[1]?arguments[1]:null;
    var extra = arguments[2]?arguments[2]:{};
    var data = {'status':errcode};
    data.message = msg;
    data = util._extend(data, extra);
    return data;
};

/**
 * 获得当前的时间戳
 * @returns {Number}
 */
exports.now = function(){
    return utility.timestamp();
};

/**
 * 根据种子值生成站内token
 * @param seed
 * @returns {{token: String, expiresIn: number}}
 */
var _generateToken = function(seed, validtime){
    var now = utility.timestamp();
    var expiresIn = now + validtime;
    var r = Math.floor(Math.random() * (now + seed)) ;
    var token = utility.md5(String(r));
    return {
        token:token,
        expiresIn:expiresIn
    };
};

/**
 * 生成站内token
 * @param uid
 * @returns {{uid: *, token: String, expiresIn: *}}
 */
exports.generateToken = function(uid){
    var result = _generateToken(uid, config.controller.token_validtime);
    result.uid = uid;
    return result;
};

/**
 * 生成重置密码的token
 * @param uid
 */
exports.generateResetToken = function(uid){
    var result = _generateToken(uid, config.controller.reset_token_validtime);
    result.uid = uid;
    return result;
};

/**
 * 新用户生成新token
 * @returns {{token, expiresIn}|{token: String, expiresIn: number}}
 */
exports.generateNewToken = function(){
    var seed = Math.floor(Math.random() * 99999) ;
    return _generateToken(seed, config.controller.token_validtime);
};

exports.videoToKey = function(uid, id){
    return util.format("%s/videos/%s",uid, id);
};

exports.videoToFrameKey = function(uid, id){
    return util.format("%s/frames/%s",uid, id);
};

exports.photoToKey = function(uid, id){
    return util.format("%s/photos/%s", uid, id);
};

exports.logRequest = function(req){
    var data = {};
    data.url = req.originalUrl;
    data.params = JSON.stringify({
        params:JSON.stringify(req.params),
        query:JSON.stringify(req.query),
        body:JSON.stringify(req.body)
    });

    var clientInfo = this.getClientInfo(req);
    if(clientInfo){
        data.uid = clientInfo.uid;
        data.token = clientInfo.token;
        data.registrationID=clientInfo.registrationID;
    }
    var appInfo = this.getAppInfo(req);
    if(appInfo){
        data.appInfo =JSON.stringify(appInfo);
    }
    data.ctime = utility.logDate();
    logRequestModel.create(data);
};
