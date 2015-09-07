/**
 * Created by im4ever on 2015/7/10.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_part = db.define('part',
    {
        pid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        pname:{type:Sequelize.STRING},
        description:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'part'

    }
);

module.exports = orm_part;
