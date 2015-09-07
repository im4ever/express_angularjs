/**
 * Created by im4ever on 2015/7/17.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_part=require('./part_model');
var orm_userParts = db.define('user_parts',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        pid:{type:Sequelize.INTEGER},
        count:{type:Sequelize.INTEGER}
    },
    {
        tableName:'user_parts'
    }
);
orm_userParts.belongsTo(orm_part,{foreignKey:'pid'});
module.exports = orm_userParts;