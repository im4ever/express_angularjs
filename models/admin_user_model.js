/**
 * Created by im4ever on 2015/7/28.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_adminUser = db.define('admin_user',
    {
        uid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        username:{type:Sequelize.STRING},
        nickname:{type:Sequelize.STRING},
        password:{type:Sequelize.STRING}
    },
    {
        tableName:'admin_user'

    }
);
module.exports = orm_adminUser;