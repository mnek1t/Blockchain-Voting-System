const {Sequelize, DataTypes} = require('sequelize')
const sequelizeConnection = require('../database/connection');

const ElectionCandidate = sequelizeConnection.define('ElectionCandidate', {
    election_id: {
        type: DataTypes.UUID,
        references: {
            model: 'elections',
            key: 'election_id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    candidate_id: {
        type: DataTypes.UUID,
        references: {
            model: 'candidates',
            key: 'candidate_id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
    }
}, {
    tableName: 'election_candidates',
    timestamps: false
});

module.exports = ElectionCandidate;
