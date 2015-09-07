/**
 * Created by im4ever on 2015/7/28.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_authRule = db.define('auth_rule',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        module:{type:Sequelize.STRING},
        type:{type:Sequelize.INTEGER},
        title:{type:Sequelize.STRING},
        name:{type:Sequelize.STRING},
        status:{type:Sequelize.INTEGER},
        condition:{type:Sequelize.STRING}
    },
    {
        tableName:'auth_rule'

    }
);
module.exports = orm_authRule;