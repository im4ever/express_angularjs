/**
 * Created by im4ever on 2015/7/28.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_authGroup = db.define('auth_group',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        module:{type:Sequelize.STRING},
        type:{type:Sequelize.INTEGER},
        title:{type:Sequelize.STRING},
        description:{type:Sequelize.STRING},
        status:{type:Sequelize.STRING},
        rules:{type:Sequelize.STRING}
    },
    {
        tableName:'auth_group'

    }
);
module.exports = orm_authGroup;