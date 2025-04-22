require('dotenv').config()

const { Sequelize } = require('sequelize');

const sequelizeConnection = new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        dialect: 'postgres',
        logging: false
    }
);

sequelizeConnection.authenticate()
    .then(() => console.log("Postgres Connected"))
    .catch(err => console.error("Database Connection Error:", err));

module.exports = sequelizeConnection;