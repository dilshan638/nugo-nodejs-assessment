var Sequelize = require('sequelize');
const sequelize = require('../controllers/helpers/dbconnect');

   const registration = sequelize.define('registration', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
       // autoIncrement: true,
    },
    name: Sequelize.STRING(255),
    email: Sequelize.STRING(150),
    address: Sequelize.STRING(255),
    city: Sequelize.STRING(100),
    country: Sequelize.STRING(30),
    created_at: Sequelize.DATEONLY
  
}, {
    freezeTableName: true,
    timestamps: false
});



module.exports = registration;
