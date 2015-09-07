/**
 * Created by qufan on 2015/8/29.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_message = db.define('message',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        type:{type:Sequelize.INTEGER},
        content:{type:Sequelize.STRING},
        code:{type:Sequelize.INTEGER},
        params:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'message'
    }
);

module.exports = orm_message;
