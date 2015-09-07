/**
 * Created by im4ever on 2015/7/28.
 */
var adminUserModel = require('./../models/admin_user_model'),
    authGroupAccessModel = require('./../models/auth_group_access_model'),
    authGroupModel = require('./../models/auth_group_model'),
    authRuleModel = require('./../models/auth_Rule_model'),
    Q = require('q'),
    customUtils = require('./../lib/customUtils'),
    customConst = require('./../lib/const'),
    util = require('util');

exports.checkUser=function(username,password){
    var deferred = Q.defer();
    adminUserModel.findOne({
        where:{
            username:username,
            password:password}
    }).then(function(data){
        if(util.isNullOrUndefined(data)){
            var result = customUtils.makeError(customConst.ERR_NO_DATA, '没有该用户的信息');
            deferred.reject(result);
        }else{
            data.password=null;
            deferred.resolve(data);
        }
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.getGroup=function(uid){
    var deferred = Q.defer();
    authGroupAccessModel.findAll({
        where:{
            uid:uid
        },
        include:{model:authGroupModel}
    }).then(function(data){
            deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};
exports.getRules=function(rules){
    rules=(rules.split(','));
    var deferred = Q.defer();
    authRuleModel.findAll({
        where:{
            id:{'$in':rules},
            status:1
        }
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};