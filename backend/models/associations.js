const Election = require('./election');
const Candidate = require('./candidate');
const ElectionCandidate = require('./electionCandidate'); 

Election.belongsToMany(Candidate, {
    through: ElectionCandidate, 
    foreignKey: 'election_id',
    otherKey: 'candidate_id'
});

Candidate.belongsToMany(Election, {
    through: ElectionCandidate,
    foreignKey: 'candidate_id',
    otherKey: 'election_id'
});

module.exports = {
    Election,
    Candidate,
    ElectionCandidate
};