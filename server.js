/**
 * Created by qufan on 2015/7/9 0009.
 * 服务器启动脚本
 */
var config = require('./config/config');
var app = require('./app.js');
app.listen(config.port);