/**
 * Created by qufan on 2015/7/10 0010.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_user = db.define('robot_user',
    {
        uid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        nickname:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'robot_user'

    }
);



module.exports = orm_user;
