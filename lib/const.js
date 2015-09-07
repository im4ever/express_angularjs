/**
 * Created by qufan on 2015/7/12 0012.
 */

exports.ERR_NONE = 0;
exports.ERR_CUSTOM = 10000;
exports.ERR_DB = 20000;
exports.ERR_PARAMS = 30000;
exports.ERR_FAILED = 40000;

exports.ERR_NO_DATA = 1000;
exports.ERR_NEED_LOGIN = 100;
exports.ERR_NEED_ADMIN = 110;
exports.ERR_NEED_UID = 101;
exports.ERR_NEED_TOKEN = 102;
exports.ERR_TOKEN_FAILED = 103;
exports.ERR_TOKEN_EXPIRED = 104;

exports.ERR_LOGIN_PASSWORD = 200;
exports.ERR_EMAIL_USED = 201;

exports.ERR_LOGIN_PASSWORD = 202;			//手机号登录密码不正确

exports.IMAGE_TYPE_AVATAR = 0;
exports.IMAGE_TYPE_MODEL = 1;

exports.STATUS_IMAGE_INIT = 0;
exports.STATUS_IMAGE_CALLBACK = 1;
exports.STATUS_IMAGE_OK = 2;
exports.STATUS_IMAGE_FORBIDDEN = -1;

exports.STATUS_VIDEO_INIT = 0;
exports.STATUS_VIDEO_CALLBACK = 1;
exports.STATUS_VIDEO_OK = 2;
exports.STATUS_VIDEO_FORBIDDEN = -1;

exports.STATUS_MODELFILE_INIT = 0;
exports.STATUS_MODELFILE_CALLBACK = 1;
exports.STATUS_MODELFILE_OK = 2;
exports.STATUS_MODELFILE_FORBIDDEN = -1;

exports.INVALID_UID = -1000;
exports.INVALID_TOKEN = -1000;

exports.STATUS_MODEL_INIT = 0;

exports.MEDIA_TYPE_PHOTO = 0;
exports.MEDIA_TYPE_VIDEO = 1;

//推送
exports.TYPE_PUSH_USER=4; //用户信息推送
exports.SCORE_PUSH='恭喜你获得积分';

//消息跳转参数
exports.JUMP_NONE = 0;
exports.JUMP_URL = 1;
exports.JUMP_MODE_INFO = 2;
exports.JUMP_CREATE = 3;

//消息显示类型
exports.MESSAGE_TYPE_INFO=0;  //信息
exports.MESSAGE_TYPE_ALERT=1;  //提醒
exports.MESSAGE_TYPE_BONUS=2;  //奖励
exports.MESSAGE_TYPE_NEWS=3;   //最新

//后台uid，代表官方
exports.USER_ADMIN = 0;