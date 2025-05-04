const {Sequelize, DataTypes} = require('sequelize')
const sequelizeConnection = require('../database/connection');

const Candidate  = sequelizeConnection.define('Candidate', {
    candidate_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(42),
        allowNull: false
    },
    party: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: false
    }
}, {
    tableName: 'candidates',
    timestamps: false
});

module.exports = Candidate;