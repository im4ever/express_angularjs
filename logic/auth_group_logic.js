/**
 * Created by im4ever on 2015/7/28.
 */
var authGroupModel = require('./../models/auth_group_model'),
    authGroupAccessModel = require('./../models/auth_group_access_model'),
    Q = require('q'),
    customUtils = require('./../lib/customUtils'),
    customConst = require('./../lib/const'),
    util = require('util'),
    utility = require('utility'),
    config = require('./../config/config');

exports.getGroups=function(where){
    var deferred = Q.defer();
    authGroupModel.findAll({
        where:where}).then(function(data){
        if(util.isNullOrUndefined(data)){
            var result = customUtils.makeError(customConst.ERR_NO_DATA, '没有用户组信息');
            deferred.reject(result);
        }else{
            deferred.resolve(data);
        }
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.addToGroup=function(uid,gid){
    var deferred= Q.defer();
    gid = util.isArray(gid)?gid:(gid.trim()).split[','][0];
    authGroupAccessModel.destroy({where:{uid:uid}}).then(function(data){
        var add=new Array();
        for(var i=0;i<gid.length;i++){
            add.push({uid:uid,group_id:gid[i]});
        }
        return authGroupAccessModel.bulkCreate(add);
    }).then(function(groups){
        deferred.resolve(groups);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.getUserGroup=function(uid){
    var deferred= Q.defer();
    authGroupAccessModel.findAll(
        {
            where:{uid:uid},
            include:[{model:authGroupModel}]
        }
    ).then(function(data){
            deferred.resolve(data);
        },function(err){
            deferred.reject(err);
        });
    return deferred.promise;
};