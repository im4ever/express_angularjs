
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_user_credit = db.define('user_credit',
    {
        uid:{
            type:Sequelize.INTEGER,
            primaryKey:true
        },
        score:{type:Sequelize.INTEGER}
    },
    {
        tableName:'user_credit'
    }
);

module.exports = orm_user_credit;