/**
 * Created by im4ever on 2015/7/13.
 */
var modelModel = require('./../models/model_model'),
    partModel = require('./../models/part_model'),
    modelPartsModel = require('./../models/model_parts_model'),
    userModelsDownloadModel = require('./../models/user_models_download_model'),
    modelTypeModel = require('./../models/model_type_model'),
    videoModel = require('./../models/video_model'),
    modelMediaModel = require('./../models/model_media_model'),
    bannerModel = require('./../models/banner_model'),
    modelCommentModel = require('./../models/model_comment_model'),
    modelFileModel = require('./../models/model_file_model'),
    userModel = require('./../models/user_model'),
    photoModel = require('./../models/photo_model'),
    modelPraiseModel = require('./../models/model_praise_model'),
    creditLogic = require('./credit_logic'),
    pushLogic=require('./push_logic'),
    Sequelize = require('sequelize'),
    customUtils = require('./../lib/customUtils'),
    constDefine = require('./../lib/const'),
    util = require('util'),
    utility = require('utility'),
    videoQiniuModel = require("./../models/video_qiniu_model"),
    Q = require('q'),
    qiniuClient = require('./../lib/qiniu_client'),
    db = require('./../lib/mysqlHelper').db;



var getModelsForNew = function (typeInfo) {
    var deferred = Q.defer();
    modelModel.findAll({
        where: Sequelize.and(
            { tid: typeInfo.tid,status:2 },
            Sequelize.or(
                { praise: 0 },
                { praise: 1 }
            )
        ),
        order: [['praise', 'desc'], ['ctime', 'desc']],
        limit: 10
    }).then(
        function (data) {
            var result = {typeInfo: typeInfo, data: data};
            deferred.resolve(result);
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

//获取所有模型
exports.getAllModels=function(where,order,page){
    var deferred = Q.defer();
    modelModel.findAndCount ({
        where:where,
        include:[{model:modelTypeModel},{model:userModel}],
        order: [['praise','desc'],[ order, 'desc' ],['ctime','desc'] ],
        limit: 20,
        offset:(page-1)*10
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

//审核模型
exports.checkModel=function(mid,status,uid,tid,pushID,errMsg){
    var deferred = Q.defer();
    var record;
    if(status>0){
        record={status:status,tid:tid};
    }else{
        record={status:status};
    }
    modelModel.update(record,{where:{mid:mid}}).then(function(data){
        return modelMediaModel.findAll({
            where:{mid:mid},
            attributes: ['mediaType']
        });
    },function(err){
        deferred.reject(err);
    }).then(function(media){
        var video=0;
        var photo=0;

        for(var i =0;i<media.length;i++){
            if(media[i].mediaType==1){
                video=video+1;
            }else if(media[i].mediaType==0){
                photo=photo+1;
            }
        }
        var action={uid:uid,description:'{video:'+video+',photo:'+photo+',controller:uploadModel}',score:((video*5)+(photo*1))}
        return creditLogic.setScore(action,pushID).then();
    },function(err){
        deferred.reject(err);
    }).then(function(data){
        if(uid>0){
            pushLogic.modelInfoPushToSingle(pushID,'恭喜你上传的模型通过审核，点击查看。',mid,constDefine.MESSAGE_TYPE_ALERT).then();
        }
        deferred.resolve(data);
    },function(err){
        console.log(err+'++++++++++++++++++');
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.setPraise=function(mid,praise){
    var deferred = Q.defer();
        modelModel.update({praise:praise},{where:{mid:mid}}).then(function(data){
            if(praise>0){
                return modelPraiseModel.create({mid:mid,praise:praise});
            }else{
                return modelPraiseModel.destroy({where:{mid:mid,praise:{$in:[1,2,3]}}});
            }
        },function(err){
            deferred.reject(err);
        }).then(function(data){
            deferred.resolve(data);
        },function(err){
            deferred.reject(err);
        });
        return deferred.promise;
};

var getModelsForRecommend = function(typeInfo){
    var deferred = Q.defer();
    modelModel.findAll({
        where: Sequelize.and(
            { tid: typeInfo.tid,status:2 },
            Sequelize.or(
                { praise: 0 },
                { praise: 2 }
            )
        ),
        order: [['praise','desc'],['score', 'desc'], ['ctime', 'desc']],
        limit: 10
    }).then(
        function (data) {
            var result = {typeInfo: typeInfo, data: data};
            deferred.resolve(result);
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

exports.more = function (tid, page, limit) {
    var deferred = Q.defer();
    modelModel.findAll(
        {
            where: {tid: tid},
            limit: limit,
            order: [['ctime', 'desc']],
            offset: (page - 1) * limit
        }
    ).then(
        function (data) {
            deferred.resolve(data);
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

exports.index = function () {
    var deferred = Q.defer();
    modelTypeModel.findAll(
        {
            where: {isDel: 0},
            order: [['ctime', 'desc']]
        }
    ).then(
        function (data) {
            var promises = [];
            for (var i = 0; i < data.length; i++) {
                promises.push(getModelsForNew(data[i]));
            }
            Q.all(promises).then(
                function (result) {
                    deferred.resolve(result);
                },
                function (err) {
                    deferred.reject(err);
                }
            )
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

exports.recommend = function () {
    var deferred = Q.defer();
    modelTypeModel.findAll(
        {
            where: {isDel: 0},
            order: [['ctime', 'desc']]
        }
    ).then(
        function (data) {
            var promises = [];
            for (var i = 0; i < data.length; i++) {
                promises.push(getModelsForRecommend(data[i]));
            }
            Q.all(promises).then(
                function (result) {
                    deferred.resolve(result);
                    //console.log(result);
                },
                function (err) {
                    deferred.reject(err);
                    //console.log(err);
                }
            )
        },
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;

};



//扫描获得某商品详情
exports.scan = function (mid) {
    var deferred = Q.defer();
    modelModel.find({
        where: {mid: mid},
        include: [{
            model: modelPartsModel,
            attributes: ['count'],
            include: {model: partModel}
        }]
    }).then(
        function (data) {
            var realData = data.dataValues;
            var recommendModels = realData.recommendModels;
            var recommends = new Array();
            if (!util.isNullOrUndefined(recommendModels)) {
                getRelationModels(recommendModels).then(
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
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

/**
 * 暂用来做推荐用的
 * @param model_parts
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.getRelationModels = function (recommendModels) {
    var deferred = Q.defer();
    if(util.isNullOrUndefined(recommendModels)){
        deferred.reject();
    }else{
        modelModel.findAll({
            where: {
                mid: {
                    $in: recommendModels.split(",")
                }
            }
        }).then(
            function (data) {
                //console.log(data);
                deferred.resolve(data);
            },
            function (err) {
                deferred.reject(err);
            }
        );
    }

    return deferred.promise;
};

//扫描获得某商品详情
exports.scan = function (mid) {
    var deferred = Q.defer();
    modelModel.find({
        where: {mid: mid},
        include: [{
            model: modelPartsModel,
            attributes: ['count'],
            include: {model: partModel}
        }]
    }).then(
        function (data) {
            var realData = data.dataValues;
            var recommendModels = realData.recommendModels;
            var recommends = new Array();
            if (!util.isNullOrUndefined(recommendModels)) {

                exports.getRelationModels(recommendModels).then(
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
        function (err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};

//获取某商品详情  多表左链接
exports.info = function (mid) {
    var deferred = Q.defer();
    var info;
    modelModel.find({
        where: {mid: mid},
        include: [
            {model: userModel,attributes: ['nickname', 'avatar','pushID']},
            {model: modelPartsModel,attributes: ['count'],include: {model: partModel}},
            {model: modelMediaModel}
        ]
    }).then(function (data) {
            info=data.dataValues;
            return data;
        },function (err) {
            deferred.reject(err);
        }).then(function(data){
            return modelCommentModel.findAll({
                where: {mid: mid},
                limit:3,
                include: {model: userModel, attributes: ['nickname', 'avatar']}
                });
            },function (err) {
                deferred.reject(err);
        }).then(function(comments){
                info.model_comments=comments;
                deferred.resolve(info);
                 },function (err) {
                    deferred.reject(err);
            });
    return deferred.promise;
};
//获取我的上传的模型
exports.getMyModels = function (uid) {
    var deferred = Q.defer();
    modelModel.findAll({
        where: {author: uid, status: {gte: 0}}
    }).then(
        function (data) {
            deferred.resolve(data);
        },
        function (err) {
            deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'no data'));
        }
    );
    return deferred.promise;
};

exports.getModelsForDownload = function (uid) {
    var deferred = Q.defer();
    userModelsDownloadModel.findAll({
        where: {uid: uid},
        include: [modelModel]
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

/**
 * 下载模型记录
 */
exports.doDownload = function (mid, uid) {
    var deferred = Q.defer();
    var record = {mid: mid, uid: uid};
    userModelsDownloadModel.create(record).then(
        function (data) {
            if (util.isNullOrUndefined(data)) {
                var result = customUtils.makeError(constDefine.ERR_DB, 'data err');
                deferred.reject(result);
            } else {
                deferred.resolve(data);
            }
        },
        function (err) {
            var result = customUtils.makeError(constDefine.ERR_DB, 'data err');
            deferred.reject(result);
        }
    );
    return deferred.promise;
};

exports.search = function (key) {
    var deferred = Q.defer();
    modelModel.findAll({
        where: {
            title: {like: '%' + key + '%'}

        },
        include: [{model: modelMediaModel}]
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

//获取模型列表
exports.getModelsForNew = function (typeId) {
    var deferred = Q.defer();
    modelModel.findAll({
        where: {type: typeId},
        order: [['isNew', 'desc'], ['ctime', 'desc']],
        limit: 10
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
//获取模型列表
exports.getModelsForScore = function (typeId) {
    var deferred = Q.defer();
    modelModel.findAll({
        where: {type: typeId},
        order: [['score', 'desc'], ['ctime', 'desc']]
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

/**
 * 上传模型文件
 * @param uid
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.uploadQiniu = function(uid, modelName, actions, parts, isAdmin){
    isAdmin = isAdmin || false;
    var deferred = Q.defer();
    var record = {uid:uid, actions:actions, modelName:modelName,parts:parts, ctime:customUtils.now(), status:constDefine.STATUS_MODELFILE_INIT};
    modelFileModel.create(record).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'create data failed'));
            }else{
                var dataResult = {mfid:data.dataValues.mfid};
                var params = {mfid:dataResult.mfid, uid:uid};
                var key = util.format("%s/models/%s",uid, dataResult.mfid);
                if(isAdmin){
                    dataResult.uptoken = qiniuClient.getModelFileUptokenInServer(params, key);
                }else{
                    dataResult.uptoken = qiniuClient.getModelFileUptoken(params, key);
                }

                dataResult.key = key;
                deferred.resolve(dataResult);
            }
        }
    )
    return deferred.promise;
};

/**
 * 模型文件上传回调
 * @param mid
 * @param url
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.callback = function(mfid, url){
    var deferred = Q.defer();
    var record = {url: url, callbackTime:customUtils.now(), status:constDefine.STATUS_MODELFILE_CALLBACK};
    modelFileModel.update(
        record,
        {
            where:{
                mfid:mfid
            }
        }
    ).then(
        function(){
            deferred.resolve();
        },
        function(){
            deferred.reject(customUtils.makeError(constDefine.ERR_DB, 'update failed'));
        }
    )
    return deferred.promise;
}

/**
 * 发布模型接口
 * @param uid
 * @param mfid
 * @param vid
 * @param pids
 * @returns {deferred.promise|{then, catch, finally}}
 */
exports.publish = function(uid,mfid, vid, pids){
    var deferred = Q.defer();
    var now = customUtils.now();
    var record = {
        author:uid,
        mfid:mfid,
        vid:vid,
        pids:pids,
        ctime:now,
        status:constDefine.STATUS_MODEL_INIT
    };
    var modelFileRecord, videoRecord, photoRecord, modelRecord;
    var mid;

    db.transaction(
        function(t){
            console.log('1');
            //查找modelFile文件记录
            return modelFileModel.findOne({
                where:{
                    mfid:mfid
                }
            }).then(
                function(data){
                    if(util.isNullOrUndefined(data)){
                        throw customUtils.makeError(constDefine.ERR_DB, 'model file not found');
                    }else{
                        modelFileRecord = data;
                        //查找视频文件记录
                        return videoQiniuModel.findOne({
                            where:{
                                vid:vid
                            }
                        });
                    }
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'model file find error');
                    }
                }
            ).then(
                function(data){
                    if(util.isNullOrUndefined(data)){
                        throw customUtils.makeError(constDefine.ERR_DB, 'video file not found');
                    }else{
                        videoRecord = data;
                        //查找图片文件记录
                        return photoModel.findAll({
                            where:{
                                pid:{
                                    $in: pids.split(",")
                                },
                                imageType:constDefine.IMAGE_TYPE_MODEL
                            }
                        });
                    }
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'video file find error');
                    }
                }
            ).then(
                function(data){
                    if(util.isNullOrUndefined(data) || data.length == 0){
                        throw customUtils.makeError(constDefine.ERR_DB, 'photo file not found');
                    }else{
                        photoRecord = data;
                        //插入模型记录
                        if(photoRecord[0].status == constDefine.STATUS_IMAGE_CALLBACK){
                            record.thumb = photoRecord[0].url;
                        }
                        if(modelFileRecord.status == constDefine.STATUS_MODELFILE_CALLBACK) {
                            record.url = modelFileRecord.url;
                            record.title = modelFileRecord.modelName;
                            record.actions = modelFileRecord.actions;
                        }
                        return modelModel.create(record,{transaction : t});
                    }
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'photo file find error');
                    }
                }
            ).then(
                function(data){
                    if(util.isNullOrUndefined(data)){
                        throw customUtils.makeError(constDefine.ERR_DB, 'model create failed');
                    }else{
                        modelRecord = data;
                        mid = modelRecord.mid;
                        var parts = modelFileRecord.parts;
                        if(util.isNullOrUndefined(parts)){
                            return true;
                        }else{
                            parts = JSON.parse(parts);
                            var partsArray = new Array();
                            for(var i = 0; i < parts.length; i++){
                                partsArray.push({mid:mid, pid:parts[i].pid, count:parts[i].count});
                            }
                            if(partsArray.length > 0){
                                return modelPartsModel.batchCreate(partsArray, {transaction:t});
                            }else{
                                return true;
                            }
                        }
                    }

                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'create model failed');
                    }
                }
            ).then(
                function(data){
                    //修改modelFileRecord记录
                    modelFileRecord.mid = mid;
                    return modelFileRecord.save({transaction : t});

                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'add model parts failed');
                    }
                }
            ).then(
                function(){
                    //插入视频media
                    if(videoRecord.status == constDefine.STATUS_VIDEO_CALLBACK){
                        var videoMediaRecord = {
                            mid:mid,
                            purl:videoRecord.purl,
                            videoUrl:videoRecord.url,
                            mediaType:constDefine.MEDIA_TYPE_VIDEO,
                            ctime:now
                        };
                        return modelMediaModel.create(videoMediaRecord,{transaction : t});
                    }else{
                        return true;
                    }
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'update model file failed');
                    }
                }
            ).then(
                function(){
                    //修改video信息
                    videoRecord.mid = mid;
                    return videoRecord.save({transaction : t});
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'add video media failed');
                    }
                }
            ).then(
                function(){
                    //插入图片media
                    var batchCreate = new Array();
                    for(var i = 0; i< photoRecord.length; i++){
                        if(photoRecord[i].status == constDefine.STATUS_IMAGE_CALLBACK){
                            batchCreate.push({mid:mid, purl:photoRecord[i].url, mediaType:constDefine.MEDIA_TYPE_PHOTO, ctime:now});
                        }
                    }
                    if(batchCreate.length == 0){
                        return true;
                    }else {
                        return modelMediaModel.bulkCreate(batchCreate,{transaction : t});
                    }
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'video update failed');
                    }
                }
            ).then(
                function(){
                    return photoModel.update(
                        {
                            mid:mid
                        },
                        {
                            where:
                            {
                                pid:{
                                    $in:pids.split(",")
                                },
                                imageType:constDefine.IMAGE_TYPE_MODEL
                            },
                            transaction : t
                        }
                    );
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'add photo media failed');
                    }
                }
            ).then(
                function(){
                    return modelRecord;
                },
                function(err){
                    if(!util.isNullOrUndefined(err.status)){
                        throw err;
                    }else{
                        throw customUtils.makeError(constDefine.ERR_DB, 'photo update failed');
                    }
                }
            );
        }
    ).then(
        function(result){
            deferred.resolve(result);
        }
    ).catch (
        function(err){
            deferred.reject(err);
        }
    );

    return deferred.promise;
};

exports.comment = function (uid, mid, content) {
    var deferred = Q.defer();
    var record={uid:uid,mid:mid,content:content,ctime: utility.timestamp()};
    modelCommentModel.create(record).then(
        function (data) {
            if (util.isNullOrUndefined(data)) {
                var result = customUtils.makeError(constDefine.ERR_DB, 'comment failed');
                deferred.reject(result);
            } else {
                deferred.resolve(data);
            }
        },
        function (err) {
            var result = customUtils.makeError(constDefine.ERR_DB, 'comment failed');
            deferred.reject(result);
        }
    );
    return deferred.promise;
};

exports.score = function (mid, score, uid) {
    var deferred = Q.defer();
    checkScore(mid, uid).then(function (isScore) {
        if (isScore == 0) {
            console.log(222 + "+++++++");
            userModelsDownloadModel.update({score: score, isScore: 1}, {
                where: {
                    mid: mid,
                    uid: uid
                }
            }).then(function (download) {
                modelModel.findById(mid).then(function (data) {
                    console.log(333 + "+++++++");
                    return data;
                }).then(function (model) {
                    console.log(444 + "+++++++");
                    console.log(model.score * model.nop + score);
                    var newScore = (Number(model.score * model.nop) + Number(score)) / (Number(model.nop) + 1);
                    newScore = (parseInt(newScore * 10, 10) / 10);
                    var nop = model.nop + 1;
                    var record = {score: newScore, nop: nop};
                    return modelModel.update(record, {where: {mid: mid}, individualHooks: true});
                }).then(function (newModel) {
                    console.log(555 + "+++++++");
                    if (util.isNullOrUndefined(newModel)) {
                        var result = customUtils.makeError(constDefine.ERR_DB, 'failed');
                        deferred.reject(result);
                    } else {
                        deferred.resolve(newModel[1][0]);
                    }
                });
            }, function (err) {
                var result = customUtils.makeError(constDefine.ERR_DB, 'update error');
                deferred.reject(result);
            });

        } else {
            console.log(111 + "+++++++");
            var result = customUtils.makeError(constDefine.ERR_DB, 'you have scored ever');
            deferred.reject(result);
        }
    });
    return deferred.promise;

};

var checkScore = function (mid, uid) {
    var deferred = Q.defer();
    userModelsDownloadModel.findOne({where: {mid: mid, uid: uid}}).then(function (data) {
        if (util.isNullOrUndefined(data)) {
            var result = customUtils.makeError(constDefine.ERR_DB, '你还没有下载');
            deferred.reject(result);
        } else {
            deferred.resolve(data.isScore);
        }
    });
    return deferred.promise;
};

exports.getComments = function (mid, page, limit) {
    var deferred = Q.defer();
    modelCommentModel.findAll({
        where: {mid: mid},
        include: {model: userModel, attributes: ['nickname', 'avatar']},
        limit: limit,
        offset: (page - 1) * limit,
        order: [['ctime', 'desc']]
    }).then(function (data) {
        deferred.resolve(data);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.getTypeInfo=function(){
    var deferred= Q.defer();
    modelTypeModel.findAll({where:{isDel:0}}).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.myComments=function(uid,page,limit){
    var deferred= Q.defer();
    modelCommentModel.findAll({
        where:{
            uid:uid
        },
        include: {model: modelModel, attributes: ['thumb', 'title']},
        offset:(page-1)*limit,
        limit:limit,
        group:'mid',
        order:[['ctime','desc']]
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};


//后台回调
exports.adminCallback=function(record){
    var deferred= Q.defer();
    modelMediaModel.create(record).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

//后台回调
exports.adminBanner=function(record){
    var deferred= Q.defer();
    bannerModel.create(record).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

//top
exports.getTop=function(){
    var deferred= Q.defer();
    bannerModel.findAll({
        order:[['ctime','desc']]
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};
exports.deleteTop=function(id){
    var deferred= Q.defer();
    bannerModel.destroy({
       where:{id:id}
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};