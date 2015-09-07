/**
 * Created by im4ever on 2015/7/28.
 */
var authGroupLogic=require('./../logic/auth_group_logic');
var utility=require('utility');
function AuthController(req, res){
    this.req=req;
    this.res=res;
}

AuthController.prototype.getUserGroup=function(){
    var instance=this;
    this.req.assert('uid', "uid不能为空").notEmpty();
    var errors = this.req.validationErrors();
    if(errors && errors.length>0)
    {
        var ermsg = [];
        for(var i=0;i<errors.length;i++)
        {
            ermsg.push(errors[i].msg);
        }
        var json={title:'管理后台-- 请先登录',error:ermsg.join("\n")};
        this.res.render('/admin/login', json);
        return;
    }
    var uid = this.req.param('uid');
    authGroupLogic.getUserGroup(uid).then(function(groups){
       console.log(groups);
    },function(err){
        if(!!err){
            var json={title:'管理后台-- 请先登录',error:err};
            instance.res.render('/admin/login', json);
        }
    });
};


module.exports = AuthController;