const jwt = require('jsonwebtoken')
const Voter = require('../models/voter');
const bcrypt = require('bcrypt')
// @desc: Login method for user authentication
// @access: public
// @route: POST /api/auth/login 
const login = async (req, res) => {
    try{
        const {personalNumber, password} = req.body;
        // find user
        const voter = await Voter.findOne({ where: {  personal_number: personalNumber }});
        if (!voter) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, voter.hashed_password);
        if(!isMatch){
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({voterId: voter.voter_id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h'})
        res.status(201).json({
            token: token
        });
    } catch(err) {
        res.status(500).json({ error: 'Login failed' });
    }
}

// @desc: Auth controller for user logout session
// @access: private
// @route: POST /api/auth/login 
const logout = async (req, res) => {
    res.status(201).json({
        message: 'Logout successful'
    });
}

module.exports = {login, logout};
