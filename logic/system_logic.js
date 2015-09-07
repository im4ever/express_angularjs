var systemUrlModel = require('./../models/system_url_model'),
    partModel=require('./../models/part_model');
    customUtils = require('./../lib/customUtils'),
    constDefine = require('./../lib/const'),
    util = require('util'),
    moment=require('moment');
    Q = require('q');

exports.getUrl=function(){
    var deferred = Q.defer();
    systemUrlModel.findOne({
        order:[['id','desc']]
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.editUrl=function(url){
    var deferred = Q.defer();
    systemUrlModel.update({url:url},{where:{id:1}}).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};
exports.getParts=function(){
    var deferred = Q.defer();
    partModel.findAll().then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};
exports.addPart=function(pname,description){
    var deferred = Q.defer();
    var record={pname:pname,description:description,ctime:moment().unix()};
    partModel.create(record).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};