/**
 * Created by qufan on 2015/7/14 0014.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_log_request = db.define('log_request',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},

        token:{type:Sequelize.STRING},
        url:{type:Sequelize.STRING},
        params:{type:Sequelize.TEXT},
        appInfo:{type:Sequelize.TEXT},
        ctime:{type:Sequelize.STRING},
        registrationID:{type:Sequelize.STRING}
    },
    {
        tableName:'log_request'
    }
);



module.exports = orm_log_request;