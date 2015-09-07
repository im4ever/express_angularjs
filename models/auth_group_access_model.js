/**
 * Created by im4ever on 2015/7/28.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var orm_authGroup= require('./auth_group_model');
var db = sequelize.db;
var orm_authGroupAccess = db.define('auth_group_access',
    {
        uid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        group_id:{type:Sequelize.INTEGER}
    },
    {
        tableName:'auth_group_access'

    }
);
orm_authGroupAccess.belongsTo(orm_authGroup,{foreignKey:'group_id'});
module.exports = orm_authGroupAccess;