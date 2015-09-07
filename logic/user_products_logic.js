/**
 * Created by im4ever on 2015/7/14.
 */
var userProductsModel = require('./../models/user_products_model'),
    productModel=require('./../models/product_model'),
    productPartsModel=require('./../models/product_parts_model'),
    partModel=require('./../models/part_model'),
    customUtil = require('./../lib/customUtils'),
    custonConst = require('./../lib/const'),
    Q = require('q');
//获取某人所有的商品
exports.getProducts=function(uid){
    var deferred = Q.defer();
    userProductsModel.findAll ({
        where:{uid:uid},
        include:[{model:productModel,include:{model:productPartsModel,attributes:['count'],include:{model:partModel}}}],
        attributes:['id']
    }).then(
        function(data){
            deferred.resolve(data);
        },
        function(err){
            deferred.reject(customUtil.makeError(custonConst.ERR_DB, 'no record'));
        }
    );
    return deferred.promise;

};