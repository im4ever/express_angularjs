/**
 * Created by im4ever on 2015/7/10.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_directive = db.define('directive',
    {
        did:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        mid:{type:Sequelize.INTEGER},
        description:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'directive'

    }
);

module.exports = orm_directive;
