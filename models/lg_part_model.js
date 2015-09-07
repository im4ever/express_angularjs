/**
 * Created by im4ever on 2015/7/22.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_part=require('./part_model');

var orm_lgpart = db.define('lg_part',
    {
        pid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name_cn:{type:Sequelize.STRING},
        name_en:{type:Sequelize.STRING},
        description_cn:{type:Sequelize.STRING},
        description_en:{type:Sequelize.STRING}
    },
    {
        tableName:'lg_part'

    }
);
orm_part.belongsTo(orm_lgpart,{foreignKey:'pid'});
module.exports = orm_lgpart;