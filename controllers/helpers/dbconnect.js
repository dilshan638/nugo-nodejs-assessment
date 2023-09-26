var Sequelize = require('sequelize');
const dotenv = require('dotenv')
require('dotenv').config()
global.Op = Sequelize.Op;
var db_name=process.env.DATABASE_NAME  
var user=process.env.USER_NAME
var password=process.env.PASSWORD_DB
var host =process.env.HOST
  const connection = new Sequelize(db_name, user, password, {
   host:host,
    dialect: 'mysql',  
    port: '3306',  
    pool: { 
        max: 100,
        min: 0,
        idle: 20000,
        acquire: 20000 
    }
});

connection
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = connection;
