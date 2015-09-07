/**
 * Created by qufan on 2015/7/11 0011.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var accountLogic = require('./../logic/account_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var userModel = require('./../models/user_model');

function AccountController(req, res){
    BaseController.call(this, req, res);
}

/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(AccountController, BaseController);

/**
 * 登录，签到
 */
AccountController.prototype.signin =  function(){
    var email = this.req.param('email');
    var password = this.req.param('password');
    var appInfo = this.appInfo;
    var instance = this;
    accountLogic.signin(email, password, appInfo).then(
        function(data){
            instance.customResponse({data:data} );
        },
        function(err){
            instance.res.json(err);
        }
    );
};


/**
 * 注册
 */
AccountController.prototype.signup = function(){
    var email = this.req.param('email');
    var password = this.req.param('password');
    var appInfo = this.appInfo;
    var instance = this;
    accountLogic.signup(email, password,appInfo).then(
        function(data){
            console.log(data);
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

/**
 * 第三方登录
 */
AccountController.prototype.signin3rd = function(){
    var openid = this.req.param('openid');
    var type = this.req.param('type');
    var accessToken = this.req.param('accessToken');
    var expiresIn = this.req.param('expiresIn');
    var nickname = this.req.param('nickname');
    var avatar = this.req.param('avatar');
    var gender = this.req.param('gender');
    var appInfo = this.appInfo;
    var instance = this;
    accountLogic.signinFrom3rdFlow(openid, type, accessToken, expiresIn, nickname, avatar,gender, appInfo).then(
        function(data){
            console.log(data);
            instance.customResponse({data:data} );
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
}

/**
 * 登出
 */
AccountController.prototype.signout = function(){
    var instance = this;
    this._checkToken().then(
        function(){
            return accountLogic.signout(this.uid, this.token);
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

/**
 * 忘记密码逻辑
 */
AccountController.prototype.forgotten = function(){
    var email = this.req.param('email');
    var instance = this;
    this._checkToken().then(
        function(){
            return accountLogic.forgotten(email);
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

AccountController.prototype.reset = function(){
    var uid = this.req.param('uid');
    var resetToken = this.req.param('resetToken');
    var instance = this;
    userModel.findOne({
        where:{
            uid:uid
        }
    }).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                instance.res.render('customError',{
                    title:'查询失败',
                    message:'两次输入的密码不一致'
                });
            }else{
                instance.res.render('reset', {
                    uid: uid,
                    resetToken: resetToken,
                    email: data.email
                });
            }
        },
        function(err){
            instance.res.render('customError',{
                title:'查询失败',
                message:'两次输入的密码不一致'
            });
        }
    );
};



/**
 * 注册后完善信息的一步，设置昵称和头像
 */
AccountController.prototype.info = function(){
    var instance = this;
    var uid = this.uid;
    var nickname = this.req.param('nickname');
    var pid = this.req.param('pid');
    var gender = this.req.param('gender');
    var data = {};
    if(!util.isNullOrUndefined(gender)){
        data.gender = gender;
    }
    if(!util.isNullOrUndefined(nickname)){
        data.nickname = nickname;
    }

    this._checkToken().then(
        function(){
            return accountLogic.modifyUserInfo(uid, pid, data);
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

/**
 * 刷新token
 */
AccountController.prototype.refreshToken = function(){
    var instance = this;
    var uid = this.uid;
    var token = this.token;
    this._checkToken().then(
        function(){
            return accountLogic.refreshToken(uid, token);
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

/**
 * 查询所有用户
 */
AccountController.prototype.getAllUsers = function(){
    var instance = this;
    var where=this.req.param('where')?this.req.param('where'):{status:0};
    var page=this.req.param('page')?this.req.param('page'):1;
    var limit=this.req.param('limit')?this.req.param('limit'):10;
    accountLogic.getAllUsers(where,page,limit).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(err.status, err.message);
    })
};

/**
 * 设置密码
 */
AccountController.prototype.pwd = function(){
    var uid = this.req.param('uid');
    var resetToken = this.req.param('resetToken');
    var newpasswd1 = this.req.param('newpasswd1');
    var newpasswd2 = this.req.param('newpasswd2');
    var instance = this;
    accountLogic.setPasswd(uid,resetToken, newpasswd1, newpasswd2).then(
        function(data){
            instance.res.render('customError',{
                title:data.title,
                message:data.message
            });
        },
        function(err){
            instance.res.render('customError',{
                title:err.title,
                message:err.message
            });
        }
    );
};
//获取用户资料
AccountController.prototype.getUserInfo=function(){
    var instance=this;
    var uid = this.req.param('uid');
    accountLogic.getUserInfo(uid).then(function(data){
        if(util.isNullOrUndefined(data)){
            instance.res.render('customError',{
                title:'查询失败',
                message:'没有该用户'
            });
        }else{
            instance.customResponse({data:data});
        }
    },function(err){
        instance.failedResponse(err);
    })
};

module.exports = AccountController;
