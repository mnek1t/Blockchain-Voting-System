const { Sequelize, DataTypes } = require('sequelize');
const sequelizeConnection = require('../database/connection');

const Election = sequelizeConnection.define('Election', {
    election_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    contract_address: {
        type: DataTypes.STRING(42),
        unique: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_by: {
        type: DataTypes.STRING(42),
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'ended', 'revealing', 'finished'),
        allowNull: false,
        defaultValue: 'active'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'elections',
    timestamps: false
});

module.exports = Election;
