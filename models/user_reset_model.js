/**
 * Created by qufan on 2015/7/25 0025.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_user_reset = db.define('user_reset',
    {
        uid:{
            type:Sequelize.INTEGER,
            primaryKey:true
        },
        resetToken:{type:Sequelize.STRING},
        expiresIn:{type:Sequelize.INTEGER},
        status:{type:Sequelize.INTEGER},
        ctime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'user_reset'
    }
);
module.exports = orm_user_reset;