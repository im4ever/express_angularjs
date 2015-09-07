/**
 * Created by qufan on 2015/8/21.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_user_3rd = db.define('user_3rd',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        type:{type:Sequelize.STRING},
        openid:{type:Sequelize.STRING},
        uid:{type:Sequelize.INTEGER},
        accessToken:{type:Sequelize.STRING},
        expiresIn:{type:Sequelize.INTEGER}
    },
    {
        tableName:'user_3rd'
    }
);

module.exports = orm_user_3rd;