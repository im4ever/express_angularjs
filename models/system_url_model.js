var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_system_url = db.define('system_url',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        url:{type:Sequelize.STRING}
    },
    {
        tableName:'system_url'
    }
);

module.exports = orm_system_url;