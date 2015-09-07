
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_user_credit=require('./user_credit_model');
var orm_user_credit_log = db.define('user_credit_log',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        score:{type:Sequelize.INTEGER},
        ctime:{type:Sequelize.STRING},
        description:{type:Sequelize.STRING}

    },
    {
        tableName:'user_credit_log'
    }
);
orm_user_credit_log.belongsTo(orm_user_credit,{foreignKey:'uid'});
module.exports = orm_user_credit_log;