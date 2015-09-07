/**
 * Created by im4ever on 2015/7/11.
 */
var productModel = require('./../models/product_model'),
    //modelModel=require('./../models/model_model'),
    productPartsModel=require('./../models/product_parts_model'),
    partModel=require('./../models/part_model'),
    productTypeModel=require('./../models/product_type_model'),
    customUtil = require('./../lib/customUtils'),
    customConst = require('./../lib/const'),
    Q = require('q'),
    modelLogic = require("./../logic/model_logic"),
    util = require('util'),
    userPartsModel = require('./../models/user_parts_model'),
    userProductModel = require('./../models/user_products_model'),
    db = require('./../lib/mysqlHelper').db;

//获取某商品详情
exports.getInfo=function(pid){
    var deferred = Q.defer();
    productModel.find ({
        where:{pid:pid},
        include: [{model:productTypeModel,attributes:['title']},{model:productPartsModel,attributes:['count'],include:{model:partModel}}]
    }).then(
        function(data){
            var realData = data.dataValues;
            var recommendModels = realData.recommendModels;
            var recommends = new Array();
            if (!util.isNullOrUndefined(recommendModels)) {
                modelLogic.getRelationModels(recommendModels).then(
                    function (result) {
                        realData.relationModels = result;
                        deferred.resolve(realData);
                    },
                    function () {
                        realData.relationModels = recommends;
                        deferred.resolve(realData);
                    }
                );
            } else {
                realData.relationModels = recommends;
                deferred.resolve(realData);
            }
        },
        function(err){
            deferred.reject(customUtil.makeError(customConst.ERR_DB, '没有商品信息'));
        }
    );
    return deferred.promise;
};

//获取商品列表
exports.getProducts=function(){
    var deferred = Q.defer();
    productModel.findAll ({
        order: [ [ 'isNew', 'desc' ],['ctime','desc'] ]
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


exports.addProduct = function(uid, pid){
    var deferred = Q.defer();
    var newParts;
    var newUserParts = new Array();
    var userParts;
    db.transaction(
        function(t){
            return productPartsModel.findAll({
                where:{product_id:pid}
            }).then(
                function(data){
                    if(util.isNullOrUndefined(data)){
                        throw customUtil.makeError(customConst.ERR_DB, 'cannot find product parts');
                    }else{
                        newParts = data;
                        return userPartsModel.findAll({
                            where:{uid:uid}
                        });
                    }

                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtil.makeError(customConst.ERR_DB, 'product parts find error');
                    }
                }
            ).then(
                function(data){
                    userParts = data;
                    return userPartsModel.destroy({where:{uid:uid}, transaction:t});
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtil.makeError(customConst.ERR_DB, 'product parts find error');
                    }
                }

            ).then(
                function(){
                    console.log(newParts);
                    if(util.isNullOrUndefined(userParts)){
                        for(var i = 0; i < newParts.length; i++){
                            newUserParts.push({uid:uid, pid:newParts[i].part_id, count:newParts[i].count});
                        }
                    }else{
                        var tmp = {};
                        for(var i = 0; i<userParts.length; i++){
                            tmp[userParts[i].pid] = userParts[i].count;
                        }
                        for(var i = 0; i < newParts.length; i++){
                            if(util.isNullOrUndefined(tmp[newParts[i].part_id])){
                                tmp[newParts[i].part_id] = newParts[i].count;
                            }else{
                                tmp[newParts[i].part_id] += newParts[i].count;
                            }
                        }
                        console.log(tmp);
                        for(var k in tmp){
                            newUserParts.push({uid:uid, pid:k, count:tmp[k]});
                        }
                    }
                    return userPartsModel.bulkCreate(newUserParts,{transaction:t});
                },
                function(err){
                    console.log(err);
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtil.makeError(customConst.ERR_DB, 'user parts destroy error');
                    }
                }
            ).then(
                function(){
                    return userProductModel.create({uid:uid, pid:pid});
                },
                function(err){
                    console.log(err);
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtil.makeError(customConst.ERR_DB, 'user parts add error');
                    }
                }
            ).then(
                function(){
                    return true;
                },
                function(err){
                    console.log(err);
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtil.makeError(customConst.ERR_DB, 'you cannot add this product twice ');
                    }
                }
            );
        }
    ).then(
        function(){
            return userPartsModel.findAll ({
                where:{uid:uid},
                include: [{model: partModel}]
            });
        }
    ).then(
        function(data){
            deferred.resolve(data);
        }
    ).catch(
        function(err){
            deferred.reject(err);
        }
    );

    return deferred.promise;


};