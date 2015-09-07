/**
 * Created by qufan on 2015/7/15 0015.
 */
var photoModel = require('./../models/photo_model'),
    Q = require('q'),
    customUtils = require('./../lib/customUtils'),
    constDefine = require('./../lib/const'),
    util = require('util'),
    utility = require('utility'),
    config = require('./../config/config'),
    qiniu_client = require('./../lib/qiniu_client'),
    userModel = require('./../models/user_model'),
    modelMediaModel = require('./../models/model_media_model');

var getUploadConfig = function(){
    return {
        callbackUrl: config.server_url + '/callback/photos',
        bucket : config.ksyun.bucket
    };
};

/**
 * 七牛的图片上传
 * @param uid
 * @param imageType
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.uploadQiniu = function(uid, imageType, isAdmin){
    var deferred = Q.defer();
    var record = {uid:uid, imageType:imageType, ctime:customUtils.now(), status:constDefine.STATUS_IMAGE_INIT};
    isAdmin = isAdmin || false;
    photoModel.create(record).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                var result = customUtils.makeError(constDefine.ERR_DB, 'photo upload failed');
                deferred.reject(result);
            }else{
                var dataResult = {pid: data.dataValues.pid};
                var params = {pid:dataResult.pid, uid:uid};
                var key = util.format("%s/photos/%s",uid, dataResult.pid);
                if(isAdmin){
                    dataResult.uptoken = qiniu_client.getPhotoUptokenInServer(params, key);
                }else{
                    dataResult.uptoken = qiniu_client.getPhotoUptoken(params,key);
                }
                dataResult.key = key;
                console.log(dataResult);
                deferred.resolve(dataResult);
            }
        },
        function(){
            var result = customUtils.makeError(constDefine.ERR_DB, 'photo upload failed');
            deferred.reject(result);
        }
    );
    return deferred.promise;
}

/**
 * 查询照片信息
 * @param pid
 * @returns {promise|*|Q.promise}
 */
exports.getPhotoInfo = function(pid){
    var deferred = Q.defer();
    var result;
    photoModel.findOne({
        where:{
            pid:pid
        }
    }).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                result = customUtils.makeError(constDefine.ERR_NO_DATA, '没有该图片的信息');
                deferred.reject(result);
            }else{
                var photoInfo = data.dataValues;
                deferred.resolve(photoInfo);
            }
        },function(err){
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

/**
 * 回调处理
 * @param pid
 * @param url
 * @param imageType
 * @returns {promise|*|Q.promise}
 */
exports.callback = function(pid, url){
    var deferred = Q.defer();
    var callbackTime = customUtils.now();
    var record = {url:url, callbackTime:callbackTime, status:constDefine.STATUS_IMAGE_CALLBACK};
    photoModel.update(record,
        {
            where:{
                pid:pid
            },
            individualHooks:true
        }
    ).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'error db'));
            }else{
                if(data[0] == 0){
                    deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'no data update'));
                }else{
                    var nowRecord = data[1][0].dataValues;
                    if(util.isNullOrUndefined(nowRecord)){
                        deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'no data update'));
                    }else{
                        var imageType = nowRecord.imageType;
                        var uid = nowRecord.uid;
                        if(imageType == constDefine.IMAGE_TYPE_AVATAR){
                            userModel.update(
                                {avatar:url},
                                {
                                    where: {
                                        uid: uid
                                    }
                                }
                            ).then(
                                function(){
                                    deferred.resolve(nowRecord);
                                },
                                function(){
                                    deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'no data update'));
                                }
                            );
                        }else if(imageType == constDefine.IMAGE_TYPE_MODEL){
                            if(!util.isNullOrUndefined(nowRecord.mid)){
                                modelMediaModel.create({mid:nowRecord.mid, purl:nowRecord.url, mediaType:constDefine.MEDIA_TYPE_PHOTO, ctime:now});
                            }
                            deferred.resolve(nowRecord);
                        }else{
                            deferred.resolve(nowRecord);
                        }
                    }
                }
            }
        },
        function(err){
            deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'update failed'));
        }
    );
    return deferred.promise;
};
