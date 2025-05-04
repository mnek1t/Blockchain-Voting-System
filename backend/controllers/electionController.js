const jwt = require('jsonwebtoken')
const {Election, Candidate} = require('../models/associations');

const { validateToken } = require("../controllers/authController");
// @desc: Save election to off chain DB
// @access: private
// @route: POST /api/election/save 
const saveElection = async (req, res) => {
    try {
        const decoded = validateToken(req);
        const {contractAddress, title, candidates, duration, status} = req.body;
        if (!contractAddress || !title || !candidates || !duration || !status) {
            return res.status(400).json({ error: 'Missing required fields:' });
        }

        const election= await Election.create({
                contract_address: contractAddress,
                title: title,
                duration: duration,
                end_time: new Date(Date.now() + duration * 1000),
                status: status,
                created_by: decoded.name
            }, { returning: true }
        );

        const candidateInstances = await Promise.all(candidates.map(async (c) => {
            const candidate = await Candidate.create({
                candidate_id: c.id,
                name: c.name,
                party: c.party,
                image: Buffer.from(c.image.split(',')[1], 'base64'),
                electionId: election.id
            });
            return candidate;
        }));
        
        await election.addCandidates(candidateInstances);

        return res.status(201).json({
            message: 'Election created',
            election
        });
    } catch(err) {
        console.error('Error saving election:', err);
        return res.status(500).json({ error: err.message });
    }
}

// @desc: Get election by id
// @access: private
// @route: GET /api/election/:id
const getElectionById = async (req, res) => {
    const decoded = validateToken(req);
    console.log(decoded);
    const election_id = req.params.id;
    try {
        const election = await Election.findOne({
            where: { election_id: election_id },
            include: Candidate,
        });

        if (!election) return res.status(404).json({ error: 'Election not found' });

        res.json(election);
    } catch (err) {
        console.error('Error fetching election:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// @desc: Get all election announced
// @access: private 
// @route: GET /api/election/all
const getAllElections = async (req, res) => {
    const decoded = validateToken(req);
    console.log(decoded)
    try {
        const elections = await Election.findAll({
            where: { status: 'active' },
            include: Candidate,
        });

        if (!elections) return res.status(404).json({ error: 'Elections not found' });

        res.json(elections);
    } catch (err) {
        console.error('Error fetching election:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {saveElection, getElectionById, getAllElections};