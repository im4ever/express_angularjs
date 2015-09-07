/**
 * Created by qufan on 2015/7/10 0010.
 */

var userModel = require('./../models/user_model'),
    userResetModel = require('./../models/user_reset_model'),
    userCreditModel = require('./../models/user_credit_model'),
    Q = require('q'),
    customUtil = require('./../lib/customUtils'),
    customConst = require('./../lib/const'),
    mail = require('./../lib/email_helper'),
    util = require('util'),
    photoLogic = require('./photo_logic'),
    config = require('./../config/config'),
    db = require("./../lib/mysqlHelper").db,
    user3rdModel = require('./../models/user_3rd_model');

/**
 * 用户注册逻辑
 * @param email
 * @param password
 */
exports.signup = function (email, password, appInfo) {
    var deferred = Q.defer();

    var record = {email: email, password: password, 'ctime': customUtil.now()};
    record = util._extend(record, appInfo);
    var userInfo;
    db.transaction(
        function (t) {
            return userModel.create(record, {transaction: t}).then(
                function (data) {
                    if (util.isNullOrUndefined(data)) {
                        throw customUtil.makeError(customConst.ERR_DB, 'failed to create user');
                        //deferred.reject(result);
                        //throw
                    } else {
                        var userInfo = data.dataValues;
                        userInfo.password = null;
                        //注册之后这里要向邮箱发邮件
                        mail.sendMail(email, 'welcome to ubtech', 'welcome to ubtech');

                        return userCreditModel.create({uid: userInfo.uid}, {transaction: t});
                        //deferred.resolve(dataResult);
                    }
                },
                function () {
                    throw customUtil.makeError(customConst.ERR_EMAIL_USED, 'email is used!');
                    //deferred.reject(result);
                }
            ).then(
                function () {
                    return userInfo;
                },
                function (err) {
                    if (!util.isNullOrUndefined(err.status)) {
                        throw err;
                    } else {
                        throw customUtil.makeError(customConst.ERR_DB, 'failed to create user credit');
                    }
                }
            );
        }
    ).then(
        function (result) {
            deferred.resolve(result);
        }
    ).catch(
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};


/**
 * 用户登录验证
 * @param email
 * @param password
 * @returns {promise|*|Q.promise}
 */
exports.signin = function (email, password, appInfo) {
    var deferred = Q.defer();
    var result;
    userModel.findOne({
        where: {
            email: email
        }
    }).then(
        function (data) {
            if (util.isNullOrUndefined(data)) {
                result = customUtil.makeError(customConst.ERR_NO_DATA, 'email is not registered');
                deferred.reject(result);
            } else {
                var userInfo = data.dataValues;
                //userInfo.registrationID = clientInfo.registrationID;
                if (userInfo.password == password) {
                    //刷新token
                    var token = customUtil.generateToken(userInfo.uid);
                    var record = util._extend(userInfo, token);
                    record = util._extend(record, appInfo);
                    userModel.update(
                        record,
                        {
                            where: {
                                uid: userInfo.uid
                            },
                            individualHooks: true
                        }
                    ).then(
                        function (data) {
                            if (util.isNullOrUndefined(data) || data[0] == 0) {
                                result = customUtil.makeError(customConst.ERR_NO_DATA, 'no user data');
                                deferred.reject(result);
                            } else {
                                var nowRecord = data[1][0].dataValues;
                                deferred.resolve(nowRecord);
                                nowRecord.password = null;
                            }
                        },
                        function () {
                            result = customUtil.makeError(customConst.ERR_DB, 'token update failed');
                            deferred.reject(result);
                        }
                    );
                } else {
                    result = customUtil.makeError(customConst.ERR_LOGIN_PASSWORD, 'wrong password');
                    deferred.reject(result);
                }
            }
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

/**
 * 处理用户忘记密码的逻辑
 * @param email
 * @returns {promise|*|Q.promise}
 */
exports.forgotten = function (email) {
    var deferred = Q.defer();
    var result;
    userModel.findOne({
        where: {
            email: email
        }
    }).then(
        function (data) {
            if (util.isNullOrUndefined(data)) {
                result = customUtil.makeError(customConst.ERR_NO_DATA, 'email is not registered');
                deferred.reject(result);
            } else {
                var record = customUtil.generateResetToken(data.uid);
                record.status = 0;
                record.ctime = customUtil.now();
                userResetModel.upsert(record).then(
                    function () {
                        var url = config.server_url + "/users/reset/" + record.uid + "/" + record.resetToken;
                        var content = "has received your reset apply, please click<a href='" + url + "'>" + url + "</a>";
                        var subject = 'System information';
                        mail.sendMail(email, subject, content);
                        result = {content: "password reset link has sent to your email"};
                        deferred.resolve(result);
                    },
                    function (err) {
                        deferred.resolve();
                    }
                );

            }
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

//设置密码
exports.setPasswd = function (uid, resetToken, newpasswd1, newpasswd2) {
    var deferred = Q.defer();
    if (newpasswd1 !== newpasswd2) {
        deferred.reject({title: 'reset failed', message: 'wrong password'});
    }
    userResetModel.findOne({
        where: {
            uid: uid,
            resetToken: resetToken,
            status: 0
        }
    }).then(
        function (data) {
            if (util.isNullOrUndefined(data)) {
                deferred.reject({title: 'reset failed', message: "reset apply is invalid"});
            } else {
                if (data.expiresIn < customUtil.now()) {
                    deferred.reject({title: 'reset failed', message: "reset apply is invalid"});
                } else {
                    var record = {password: newpasswd1};
                    userModel.update(record, {
                        where: {
                            uid: uid
                        }
                    }).then(
                        function (data) {
                            userResetModel.update({status: 1}, {
                                where: {
                                    uid: uid
                                }
                            });
                            deferred.resolve({title: 'reset succeed', message: "reset succeed"});
                        },
                        function (err) {
                            deferred.reject({title: 'reset failed', message: "fail to save data"});
                        }
                    )
                }
            }
        },
        function (err) {
            deferred.reject({title: 'reset failed', message: "data query failed"});
        }
    );
    return deferred.promise;

};

/**
 * 用户登出
 * @returns {promise|*|Q.promise}
 */
exports.signout = function (uid, token) {
    var deferred = Q.defer();
    var result;
    userModel.update({expiresIn: customUtil.now() - 1200},
        {
            where: {
                uid: uid,
                token: token
            }
        }
    ).then(
        function (data) {
            console.log(data);
            if (!util.isNullOrUndefined(data) && data[0] > 0) {
                result = {message: 'signout succeed'};
                deferred.resolve(result);
            } else {
                result = customUtil.makeError(customConst.ERR_EMAIL_USED, 'wrong token, please signin again');
                deferred.reject(result);
            }
        },
        function () {
            result = customUtil.makeError(customConst.ERR_EMAIL_USED, 'wrong token, please signin again');
            deferred.reject(result);
        }
    );
    return deferred.promise;
};

/**
 * 判断当前请求是否处于登录状态，会验证token有效
 * @param req
 * @returns {promise|*|Q.promise}
 */
exports.isLogin = function (req) {
    var deferred = Q.defer();
    var userToken = customUtil.getClientInfo(req);
    var result;
    if (userToken) {
        userModel.findOne({
            where: {
                uid: userToken.uid,
                token: userToken.token
            }
        }).then(
            function (data) {
                if (util.isNullOrUndefined(data)) {
                    result = customUtil.makeError(customConst.ERR_TOKEN_FAILED, 'wrong token, please signin again');
                    deferred.reject(result);
                } else {
                    if (data.expiresIn < Date.now() / 1000) {
                        result = customUtil.makeError(customConst.ERR_TOKEN_EXPIRED, 'wrong token, please signin again');
                        deferred.reject(result);
                    } else {
                        deferred.resolve(data);
                    }
                }
            },
            function (err) {
                result = customUtil.makeError(customConst.ERR_DB, 'query failed');
                deferred.reject(result);
            }
        );
    } else {
        result = customUtil.makeError(customConst.ERR_NEED_LOGIN, 'please signin');
        deferred.reject(result);
    }
    return deferred.promise;
};

/**
 * token验证
 * @param uid
 * @param token
 * @returns {promise|*|Q.promise}
 */
exports.checkToken = function (uid, token) {
    var deferred = Q.defer();
    userModel.findOne({
        where: {
            uid: uid,
            token: token
        }
    }).then(
        function (data) {
            deferred.resolve(data);
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

//刷新token
exports.refreshToken = function (uid, token) {
    var deferred = Q.defer();
    userModel.findOne({
        where: {
            uid: uid,
            token: token
        }
    }).then(
        function (data) {
            if (data) {
                var now = customUtil.now();
                var record = data.dataValues;
                if (record.expiresIn < now) {
                    var result = customUtil.makeError(customConst.ERR_NEED_LOGIN, 'token expires, please signin again');
                    deferred.reject(result);
                } else {
                    var newToken = customUtil.generateToken(uid);

                    userModel.update(
                        newToken,
                        {
                            where: {
                                uid: uid
                            },
                            individualHooks: true
                        }
                    ).then(
                        function (data) {
                            var nowRecord = data[1][0].dataValues;
                            if (util.isNullOrUndefined(nowRecord)) {
                                result = customUtil.makeError(customConst.ERR_DB, 'token update failed');
                                deferred.reject(result);
                            } else {
                                deferred.resolve(newToken);
                            }
                        },
                        function (err) {
                            result = customUtil.makeError(customConst.ERR_DB, 'token update failed');
                            deferred.reject(result);
                        }
                    );
                }
            } else {
                result = customUtil.makeError(customConst.ERR_NEED_LOGIN, 'please signin');
                deferred.reject(result);
            }
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

/**
 * 修改个人信息
 * @param uid
 * @param nickname
 * @param pid
 * @param gender
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.modifyUserInfo = function (uid, pid, data) {
    var deferred = Q.defer();
    var userInfo = data;
    console.log(userInfo);
    if (util.isNullOrUndefined(pid)) {
        userModel.update(
            userInfo,
            {
                where: {
                    uid: uid
                },
                individualHooks: true
            }
        ).then(
            function (data) {
                if (util.isNullOrUndefined(data) || data[0] == 0) {
                    result = customUtil.makeError(customConst.ERR_DB, 'update failed');
                    deferred.reject(result);
                } else {
                    var nowRecord = data[1][0].dataValues;
                    deferred.resolve(nowRecord);
                }
            },
            function () {
                result = customUtil.makeError(customConst.ERR_DB, 'update failed');
                deferred.reject(result);
            }
        );
    } else {
        photoLogic.getPhotoInfo(pid).then(
            function (data) {
                //var userInfo = {nickname: nickname, avatar: data.url};
                userInfo.avatar = data.url;
                userModel.update(
                    userInfo,
                    {
                        where: {
                            uid: uid
                        },
                        individualHooks: true
                    }
                ).then(
                    function (data) {
                        var nowRecord = data[1][0].dataValues;
                        if (util.isNullOrUndefined(nowRecord)) {
                            result = customUtil.makeError(customConst.ERR_DB, 'update failed');
                            deferred.reject(result);
                        } else {
                            deferred.resolve(nowRecord);
                        }
                    },
                    function () {
                        result = customUtil.makeError(customConst.ERR_DB, 'update failed');
                        deferred.reject(result);
                    }
                );
            },
            function () {
                deferred.reject(customUtil.makeError(customConst.ERR_DB, 'update failed'));
            }
        );
    }
    return deferred.promise;
};

exports.allUser = function () {
    var deferred = Q.defer();
    userModel.findAll().then(
        function (data) {
            deferred.resolve(data);
        }, function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

//admin-getUserList by where

exports.getAllUsers = function (where, page) {
    where = eval('(' + where + ')');
    var deferred = Q.defer();
    userModel.findAndCountAll({
        where: where,
        order: [['ctime', 'desc']],
        limit: 10,
        offset: (page - 1) * 10
    }).then(
        function (data) {
            deferred.resolve(data);
        }, function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

/**
 * 第三方授权登录
 * @param openid
 * @param type
 * @param nickname
 * @param avatar
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.signinFrom3rd = function (openid, type, accessToken, expiresIn, nickname, avatar, appInfo) {
    var deferred = Q.defer();
    //var userInfo = {nickname: nickname, avatar: avatar, ctime: customUtil.now(),registrationID:appInfo.registrationID};
    var userInfo = {nickname: nickname, avatar: avatar, ctime: customUtil.now()};
    userInfo = util._extend(userInfo, appInfo);

    user_3rd_model.find(
        {
            where: {
                openid: openid,
                type: type
            }
        }
    ).then(
        function (data) {
            if (util.isNullOrUndefined(data)) {
                userModel.create(userInfo).then(
                    function (data2) {
                        var uid = data2.uid;
                        //刷新token
                        var token = customUtil.generateToken(uid);
                        userInfo = util._extend(userInfo, token);
                        var record = {
                            uid: uid,
                            openid: openid,
                            type: type,
                            accessToken: accessToken,
                            expiresIn: expiresIn
                        };
                        user_3rd_model.create(record).then();
                        userCreditModel.create({uid: uid}).then();
                        deferred.resolve(data2);
                    },
                    function () {
                        deferred.reject(customUtil.makeError(customConst.ERR_DB, 'create user failed'));
                    }
                );
            } else {
                var uid = data.uid;
                userModel.find(
                    {
                        where: {
                            uid: uid
                        }
                    }
                ).then(
                    function (userInfo) {
                        deferred.resolve(userInfo);
                    },
                    function (err) {
                        deferred.reject(customUtil.makeError(customConst.ERR_DB, 'query user failed'));
                    }
                )

            }
        },
        function () {
            deferred.reject(customUtil.makeError(customConst.ERR_DB, 'query user failed'));
        }
    );
    return deferred.promise;
};

/**
 * 用户登录验证
 * @param email
 * @param password
 * @returns {promise|*|Q.promise}
 */
exports.signinFlow = function (email, password, appInfo) {
    var deferred = Q.defer();
    userModel.findOne({
        where: {
            email: email
        }
    }).then(
        function (user) {
            if (util.isNullOrUndefined(user)) {
                result = customUtil.makeError(customConst.ERR_NO_DATA, 'invalid email');
                console.log(result);
                throw result;
            } else {
                var userInfo = user.dataValues;
                if (userInfo.password == password) {
                    var token = customUtil.generateToken(userInfo.uid);
                    var record = util._extend(userInfo, token);
                    record = util._extend(userInfo, appInfo);
                    return userModel.update(
                        record,
                        {
                            where: {
                                uid: userInfo.uid
                            },
                            individualHooks: true
                        }
                    )
                } else {
                    result = customUtil.makeError(customConst.ERR_LOGIN_PASSWORD, 'wrong password');
                    throw result;
                }
            }
        }
    ).then(function (user) {

            deferred.resolve(user)
        },
        function (err) {
            result = customUtil.makeError(customConst.ERR_LOGIN_PASSWORD, 'login failed');
            //throw new Error(result);
            deferred.reject(result);
        });

    return deferred.promise;
};

/**
 * 第三方授权登录
 * @param openid
 * @param type
 * @param nickname
 * @param avatar
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.signinFrom3rdFlow = function (openid, type, accessToken, expiresIn, nickname, avatar, gender, appInfo) {
    var deferred = Q.defer();
    var now = customUtil.now();
    var userInfo = {nickname: nickname, avatar: avatar, gender: gender, ctime: now};
    var token = customUtil.generateNewToken();
    userInfo = util._extend(userInfo, appInfo);
    userInfo = util._extend(userInfo, token);
    var record = {
        openid: openid,
        type: type,
        accessToken: accessToken,
        expiresIn: expiresIn
    };
    var uid;
    user3rdModel.find(
        {
            where: {
                openid: openid,
                type: type
            }
        }
    ).then(
        function (data) {
            if (util.isNullOrUndefined(data)) {
                //新用户，需要创建
                db.transaction(function (t) {

                    userInfo.lastLogin = now;
                    return userModel.create(userInfo, {transaction: t}).then(
                        function (data) {
                            if (util.isNullOrUndefined(data)) {
                                throw customUtil.makeError(customConst.ERR_DB, "user create failed");
                            } else {
                                uid = data.uid;
                                userInfo = data.dataValues;
                                return userCreditModel.create({uid: uid}, {transaction: t});
                            }
                        },
                        function () {
                            throw customUtil.makeError(customConst.ERR_DB, "user create failed");
                        }
                    ).then(
                        function (data) {
                            if (util.isNullOrUndefined(data)) {
                                throw customUtil.makeError(customConst.ERR_DB, "user credit create failed");
                            } else {
                                record.uid = uid;
                                return user3rdModel.create(record, {transaction: t});
                            }
                        },
                        function (err) {
                            if (!util.isNullOrUndefined(err.status)) {
                                throw err;
                            } else {
                                throw customUtil.makeError(customConst.ERR_DB, 'user credit create failed');
                            }
                        }
                    ).then(
                        function (data) {
                            if (util.isNullOrUndefined(data)) {
                                throw customUtil.makeError(customConst.ERR_DB, "user 3rd create failed");
                            } else {
                                return data;
                            }
                        },
                        function () {
                            if (!util.isNullOrUndefined(err.status)) {
                                throw err;
                            } else {
                                throw customUtil.makeError(customConst.ERR_DB, 'user 3rd create failed');
                            }
                        }
                    );
                }).then(
                    function () {
                        deferred.resolve(userInfo);
                    }
                ).catch(
                    function (err) {
                        deferred.reject(err);
                    }
                );
            } else {
                //老用户，更新user3rd的信息和user内的token信息
                db.transaction(function (t) {
                    uid = data.uid;
                    return user3rdModel.update(record,
                        {
                            where: {
                                openid: openid,
                                type: type
                            },
                            transaction: t
                        }
                    ).then(
                        function () {
                            return userModel.update(userInfo, {
                                where: {
                                    uid: uid
                                },
                                transaction: t,
                                individualHooks: true
                            })
                        },
                        function () {
                            console.log('111');
                            throw customUtil.makeError(customConst.ERR_DB, 'user 3rd update failed');
                        }
                    ).then(
                        function (data) {
                            if (util.isNullOrUndefined(data) || data[0] == 0) {
                                console.log('222');
                                throw customUtil.makeError(customConst.ERR_DB, 'user update failed');
                            } else {
                                userInfo = data[1][0].dataValues;
                                return true;
                            }
                        },
                        function (err) {
                            if (!util.isNullOrUndefined(err.status)) {
                                throw err;
                            } else {
                                console.log(err);
                                console.log('333');
                                throw customUtil.makeError(customConst.ERR_DB, 'user update failed');
                            }

                        }
                    );
                }).then(
                    function () {
                        deferred.resolve(userInfo);
                    }
                ).catch(
                    function (err) {
                        deferred.reject(err);
                    }
                )
            }
        },
        function () {
            deferred.reject(customUtil.makeError(customConst.ERR_DB, "user_3rd find err"));
        }
    );


    //user_3rd_model.find(
    //    {
    //        where: {
    //            openid: openid,
    //            type: type
    //        }
    //    }
    //).then(
    //    function (data) {
    //        if (util.isNullOrUndefined(data)) {
    //            var token = customUtil.generateNewToken();
    //            userInfo = util._extend(userInfo, token);
    //            userInfo.lastLogin = now;
    //            //找不到记录，先在user表中创建记录，再在user_3rd中创建记录
    //            return userModel.create(userInfo).then(
    //                function (data2) {
    //                    var uid = data2.uid;
    //                    record.uid = uid;
    //                    userCreditModel.create({uid:uid});
    //                    return user_3rd_model.create(record).then(
    //                        undefined,
    //                        function(){
    //                            throw customUtil.makeError(customConst.ERR_DB, "create user failed");
    //                        }
    //                    );
    //                },
    //                function (err) {
    //                    //deferred.reject(err);
    //                    throw customUtil.makeError(customConst.ERR_DB, "create user failed");
    //                }
    //            );
    //        } else {
    //            //找到记录情况下，要去更新user_3rd方面的内容
    //            var uid = data.uid;
    //            return userModel.update(
    //                record,
    //                {
    //                    where: {
    //                        openid: openid,
    //                        type: type
    //                    },
    //                    individualHooks: true
    //                }
    //            ).then(
    //                undefined,
    //                function(err){
    //                    throw customUtil.makeError(customConst.ERR_DB, "cannot find user");
    //                }
    //            );
    //        }
    //    }
    //
    //).then(
    //    function(data){
    //        deferred.resolve(data);
    //    },
    //    function(err){
    //        deferred.reject(err);
    //    }
    //);
    return deferred.promise;
};

exports.getUserInfo = function (uid) {
    var deferred = Q.defer();
    userModel.findById(uid).then(function (data) {
        var user = data;
        user.password = "";
        deferred.resolve(user);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};
