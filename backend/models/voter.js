const {Sequelize, DataTypes} = require('sequelize')
const sequelizeConnection = require('../database/connection');

const Voter  = sequelizeConnection.define('Voter', {
    voter_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
    },
    personal_number: {
        type: DataTypes.STRING(12),
        primaryKey: true,
        allowNull: false,
        validate: {
            is: /^[0-9]{6}-[0-9]{5}$/ 
        }
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email_address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBefore: new Date().toISOString().split('T')[0]
        }
    },
    hashed_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('voter', 'admin'),
        allowNull: false,
        defaultValue: 'voter'
    }
}, {
    tableName: 'voters',
    timestamps: false
});

module.exports = Voter;