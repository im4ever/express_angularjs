/**
 * Created by im4ever on 2015/7/13.
 */
var util = require('util');
var BaseController = require('./_base_controller');
var modelLogic = require('./../logic/model_logic'),

    directiveLogic = require('./../logic/directive_logic');
var customUtils = require('./../lib/customUtils');
var customConst = require('./../lib/const');
var ModelController=function(req,res){
    BaseController.call(this, req, res);
};
/**
 * 此语句必须紧跟着构造函数，否则后面的方法将无效
 */
util.inherits(ModelController, BaseController);


ModelController.prototype.index = function(){
    var instance=this;
    modelLogic.index().then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
        }
    )
};

//推荐模型获取
ModelController.prototype.recommend = function(){
    var instance=this;
    modelLogic.recommend().then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
        }
    )
};



//按类型分类模型的更多
ModelController.prototype.more = function(){
    var instance=this;
    var tid=this.req.param('tid');
    var page=this.req.param('page')?this.req.param('page'):1;
    var limit=this.req.param('limit')?this.req.param('limit'):10;
    modelLogic.more(tid,page,limit).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
        }
    )
};

/**
 * 扫描获得商品信息
 */
ModelController.prototype.scan = function(){
    var mid = this.req.param("mid");
    var instance=this;
    modelLogic.scan(mid).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
    });
}

//获取某型详情
ModelController.prototype.info=function(){
    var mid=this.req.param("mid");
    var instance=this;
    modelLogic.info(mid).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
    });
};

//获取我上传的模型
ModelController.prototype.getMyModels=function(){
    var instance=this;
    var uid = this.uid;
    this._checkToken().then(
        function(){
            return modelLogic.getMyModels(uid);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

//获取我下载的模型
ModelController.prototype.getModelsForDownload=function(){
    var instance=this;
    var uid = this.uid;
    this._checkToken().then(
        function(){
            return modelLogic.getModelsForDownload(uid);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

/**
 * 记录下载模型动作的接口
 */
ModelController.prototype.doDownload=function(){
    var instance=this;
    var uid = this.uid;
    var mid=this.req.param('mid');
    this._checkToken().then(
        function(){
            return modelLogic.doDownload(mid, uid);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

//模型搜索
ModelController.prototype.search=function(){
    var key=this.req.param('key');
    var instance=this;
    modelLogic.search(key).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
    });
};

//最新模型列表
ModelController.prototype.getModelsForNew=function(){
    var instance=this;
    modelLogic.getModelsForNew().then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
    });
};

//最新模型列表
ModelController.prototype.getModelsForScore=function(){
    var instance=this;
    modelLogic.getModelsForScore().then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model info",err);
    });
}

//上传模型文件
ModelController.prototype.upload = function(){
    var instance = this;
    var uid = this.uid;
    var modelName = this.req.param("modelName");
    var actions = this.req.param("actions");
    var parts = this.req.param("parts");
    this._checkToken().then(
        function(){
            return modelLogic.uploadQiniu(uid, modelName, actions, parts);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

//模型发布接口
ModelController.prototype.publish = function(){
    var instance = this;
    var uid = this.uid;
    var mfid = this.req.param("mfid");
    var pids = this.req.param("pids");
    var vid = this.req.param("vid");
    this._checkToken().then(
        function(){
            return modelLogic.publish(uid, mfid, vid, pids);
        },
        function(){
            instance._needLoginResponse();
        }

    ).then(
        function(data){
            instance.customResponse({data:data});
        },
        function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

//评论
ModelController.prototype.comment=function(){
    var instance=this;
    var uid = this.uid;
    var mid=this.req.param('mid');
    var content=this.req.param('content');
    this._checkToken().then(
        function(){
            return modelLogic.comment(uid, mid, content);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

//评分
ModelController.prototype.score=function(){
    var instance=this;
    var uid = this.uid;
    var mid=this.req.param('mid');
    var score=this.req.param('score');
    this._checkToken().then(
        function(){
            return modelLogic.score(mid,score,uid);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};

ModelController.prototype.getComments=function(){
    var instance=this;
    var mid=this.req.param('mid');
    var page=this.req.param('page')?this.req.param('page'):1;
    var limit=this.req.param('limit')?this.req.param('limit'):10;
    modelLogic.getComments(mid,page,limit).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model comment",err);
    })
};

//获取所有模型 后台用含排序方式
ModelController.prototype.getAllModels=function(){
    var instance=this;
    var where=this.req.param('where')?this.req.param('where'):{status:1};
    var order=this.req.param('order')?this.req.param('order'):ctime;
    var page=this.req.param('page')?this.req.param('page'):1;
    where=eval('('+where+')');
    console.log(where);
    modelLogic.getAllModels(where,order,page).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model comment",err);
    })
};

//后台审核
ModelController.prototype.checkModel=function(){
    var instance=this;
    var mid=this.req.param('mid');
    var status=this.req.param('status');
    var errMsg=this.req.param('errMsg');
    var tid=this.req.param('tid');
    var uid=this.req.param('uid');
    var pushID=this.req.param('pushID');
    modelLogic.checkModel(mid,status,uid,tid,pushID,errMsg).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model comment",err);
    });
};

//后台推荐
ModelController.prototype.setPraise=function(){
    var instance=this;
    var mid=this.req.param('mid');
    var praise=this.req.param('praise');
    modelLogic.setPraise(mid,praise).then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model comment",err);
    });
};

//获取分类
ModelController.prototype.getTypeInfo=function(){
    var instance=this;
    modelLogic.getTypeInfo().then(function(data){
        instance.customResponse({data:data});
    },function(err){
        instance.failedResponse(customConst.ERR_NO_DATA,"failed model comment",err);
    });
};

ModelController.prototype.myComments=function(){
    var instance=this;
    var uid = this.uid;
    var page = this.req.param('page')?this.req.param('page'):1;
    var limit = this.req.param('limit')?this.req.param('limit'):10;
    this._checkToken().then(
        function(){
            return modelLogic.myComments(uid,page,limit);
        },
        function(){
            instance._needLoginResponse();
        }
    ).then(
        function(data){
            instance.customResponse({data:data});
        },function(err){
            instance.failedResponse(err.status, err.message);
        }
    );
};



module.exports = ModelController;
