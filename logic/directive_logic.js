/**
 * Created by im4ever on 2015/7/13.
 */
var directiveModel = require('./../models/directive_model'),
    modelModel=require('./../models/model_model'),
    customUtils = require('./../lib/customUtils'),
    constDefine = require('./../lib/const'),
    util = require('util'),
    Q = require('q');

//获取某model下所有指令
exports.getDirectives=function(mid){
    var deferred = Q.defer();
    directiveModel.findAll ({
        where:{mid:mid}
    }).then(
        function(data){
            deferred.resolve(data);
        },
        function(err){
            deferred.reject(err);
        }
    );
    return deferred.promise;

};
//循环插入某模型的指令
exports.upload=function(data,records){
    var deferred = Q.defer();
    var promises = [];
    var array=eval(records);
    var ctime= Date.parse(new Date());
    for(var i=0;i<array.length;i++){
        array[i]['mid']=data.mid;
        array[i]['ctime']=ctime/1000;
        promises.push(insert(array[i]));
    }
    Q.all(promises).then(
        function(result){
            deferred.resolve(data);
            //console.log(result);
        },
        function(err){
            deferred.reject(err);
            //console.log(err);
        }
    );
    return deferred.promise;
};


//存储指令
var insert=function(record){
    var deferred = Q.defer();
    directiveModel.create(record).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                var result = customUtils.makeError(constDefine.ERR_DB, '上传模型失败');
                deferred.reject(result);
            }else{
                deferred.resolve(data);
            }
        },
        function(err){
            var result = customUtils.makeError(constDefine.ERR_DB, err);
            deferred.reject(result);
        }
    );
    return deferred.promise;
};