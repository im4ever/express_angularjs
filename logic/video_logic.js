/**
 * Created by qufan on 2015/7/27 0027.
 */
var Q = require('q'),
    customUtils = require('./../lib/customUtils'),
    constDefine = require('./../lib/const'),
    util = require('util'),
    utility = require('utility'),
    config = require('./../config/config'),
    videoQiniuModel = require('./../models/video_qiniu_model'),
    qiniuClient = require('./../lib/qiniu_client'),
    modelMediaModel = require('./../models/model_media_model');


exports.uploadVideo = function(uid, isAdmin){
    var deferred = Q.defer();
    var record = {uid:uid, ctime:customUtils.now(), status:constDefine.STATUS_VIDEO_INIT};
    isAdmin = isAdmin || false;
    videoQiniuModel.create(record).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                var result = customUtils.makeError(constDefine.ERR_DB, 'video upload failed');
                deferred.reject(result);
            }else{
                var dataResult = {vid: data.dataValues.vid};
                var params = {vid:dataResult.vid, uid:uid};
                var key = customUtils.videoToKey(uid, dataResult.vid);
                if(isAdmin){
                    dataResult.uptoken = qiniuClient.getVideoUptokenInServer(params, key);
                }else{
                    dataResult.uptoken = qiniuClient.getVideoUptoken(params,key);
                }

                dataResult.key = key;
                deferred.resolve(dataResult);
            }
        },
        function(){
            var result = customUtils.makeError(constDefine.ERR_DB, 'video upload failed');
            deferred.reject(result);
        }
    );
    return deferred.promise;

};

exports.callback = function(vid, url){
    var deferred = Q.defer();
    var record = {url:url, callbackTime:customUtils.now(), status:constDefine.STATUS_VIDEO_CALLBACK};
    videoQiniuModel.update(record,
        {
            where:{
                vid:vid
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
                    console.log(data);
                    var nowRecord = data[1][0].dataValues;
                    if(util.isNullOrUndefined(nowRecord)){
                        deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'no data update'));
                    }else{

                        var uid = nowRecord.uid;
                        var key = customUtils.videoToKey(uid, vid);
                        var frameKey = customUtils.videoToFrameKey(uid, vid);
                        qiniuClient.getFrame(key, frameKey).then(
                            function(){
                                var purl = qiniuClient.getFileUrl(frameKey);
                                videoQiniuModel.update(
                                    {purl:purl},
                                    {
                                        where:{
                                            vid:vid
                                        }
                                    }
                                );
                                if(!util.isNullOrUndefined(nowRecord.mid)){
                                    var videoMediaRecord ={
                                            mid:nowRecord.mid,
                                            purl:purl,
                                            videoUrl:nowRecord.url,
                                            mediaType:constDefine.MEDIA_TYPE_VIDEO,
                                            ctime:customUtils.now()
                                    };
                                    modelMediaModel.create(videoMediaRecord);
                                }

                                nowRecord.purl = purl;
                                console.log(nowRecord);
                                console.log('++++++++++++++');
                                deferred.resolve(nowRecord);
                            },
                            function(){
                                //��ȡ֡ʧ�ܣ�����Ӱ���ϴ�����Ҫ�߼�
                                deferred.resolve(nowRecord);
                            }
                        )
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


exports.persistentCallback = function(){
    var deferred = Q.defer();
    deferred.resolve();
    return deferred.promise;
};

