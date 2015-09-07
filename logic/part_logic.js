/**
 * Created by im4ever on 2015/7/17.
 */
var userPartsModel = require('./../models/user_parts_model'),
    partModel=require('./../models/part_model'),
    customUtils = require('./../lib/customUtils'),
    constDefine = require('./../lib/const'),
    util = require('util'),
    Q = require('q');
exports.getMyParts=function(uid){
    var deferred = Q.defer();
    userPartsModel.findAll ({
        where:{uid:uid},
        include: [{model: partModel}]
    }).then(
        function(data){
            deferred.resolve(data);
        },
        function(err){
            deferred.reject(customUtils.makeError(constDefine.ERR_DB,'no data'));
        }
    );
    return deferred.promise;
};
//编辑我的零件数
exports.partsEdit=function(record){
    var deferred = Q.defer();
    userPartsModel.upsert (record).then(
        function(data){
            deferred.resolve(data);
        },
        function(err){
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

exports.edit=function(records,uid){
    var deferred = Q.defer();
    var promises = [];
    var array=eval(records);
    for(var i=0;i<array.length;i++){
        array[i]['uid']=uid;
        promises.push(update(array[i]));
    }

    Q.all(promises).then(
        function(result){
            deferred.resolve(result);
            //console.log(result);
        },
        function(err){
            deferred.reject(customUtils.makeError(constDefine.ERR_DB,'update failed'));
            //console.log(err);
        }
    );
    return deferred.promise;
};

var update=function(record){
    var deferred = Q.defer();
    userPartsModel.update(record,{where:{pid:record.pid,uid:record.uid}}).then(
        function(data){
            deferred.resolve(record);
        },
        function(err){
            deferred.reject(err);
        }
    );
    return deferred.promise;
};