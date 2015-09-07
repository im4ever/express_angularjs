/**
 * Created by qufan on 2015/7/9 0009.
 * 应用配置
 */

"use strict";
var config = require('./config');

var cc_config = {
    charset:'utf-8',
    user_id : '101E72FAC6E8E1C8',
    playerid: '302764E799B62908',
    key: 'rCrkatvWbZdBuyiwvTzdphM5i88UH2hI',
    api_videos: 'http://spark.bokecc.com/api/videos',
    api_user: 'http://spark.bokecc.com/api/user',
    api_playcode: 'http://spark.bokecc.com/api/video/playcode',
    api_deletevideo : 'http://spark.bokecc.com/api/video/delete',
    api_editvideo : 'http://spark.bokecc.com/api/video/update',
    api_video : 'http://spark.bokecc.com/api/video',
    api_category : 'http://spark.bokecc.com/api/video/category',
    notify_url:config.server_url + 'notify.php'

};

module.exports = cc_config;