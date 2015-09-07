/**
 * Created by qufan on 2015/7/9 0009.
 * 应用配置
 */

"use strict";

var config = {
    server_url: 'http://ubtech.nizaiganma.cn',
    cookie_domain: '127.0.0.1',
    version: '2015060601',
    appname: 'robot',
    port:3000,
    enableCluster:false,
    debug:true,
    session_secret: 'panda',

    controller:{
        record_request: true,
        check_token: false,
        token_validtime: 1296000,
        reset_token_validtime: 86400
    },

    cc:{
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
        notify_url:'http://notify.php'
    },

    ksyun:{
        access_url:'kssws.ks-cdn.com',
        bucket:'robot',
        access_key:'JCEC2ERIUTMF4NZNHLKQ',
        secret_key:'kYcWtYty4CQLgoYgbDej/HFdo2XOAB33qbfyMkfw'
    },

    db:{
        host    :   '123.59.12.4',
        port    :   4040,
        user    :   'admin',
        password:   'Naocanfen38',
        database:   'robot',
        pool:{
            max:5,
            min:0,
            idle:10000
        }
    },
    getui:{
        AppID: 'iupebiN0Bn9FySPT3MSJq5',
        AppKey:'E1UGnTdL2n7lHAuCty9O98',
        AppSecret:'JmwNV9urGZ5qVvBIVfW7L4',
        MasterSecret:'49XsBH8jRP65H4OxB6eJk9'
    }
};

module.exports = config;