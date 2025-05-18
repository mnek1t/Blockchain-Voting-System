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
        const token = jwt.sign({
            voterId: voter.voter_id, 
            role: voter.role,
            name: voter.first_name + ' ' + voter.last_name
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1h'})
        res.cookie('BVS', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
            sameSite:'lax'
        })
        res.status(201).json({
            message: 'Login Successful',
            role: voter.role
        });
    } catch(err) {
        res.status(500).json({ error: 'Login failed' });
    }
}

// @desc: Logout method for user authentication
// @access: private
// @route: POST /api/auth/logout 
const logout = async (req, res) => {
    try {
        validateToken(req);
        res.clearCookie('BVS', { httpOnly: true, sameSite: 'lax', secure: false });
        res.status(201).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// @desc: Get auth user data 
// @access: public
// @route: GET /api/auth/user/me 
const getMe = (req, res) => {
    try {
        const decoded = validateToken(req);
        res.status(200).json({ 
            voterId: decoded.voterId, 
            role: decoded.role,
            name: decoded.name 
        });
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// @desc: Validate JWT Token for user authentication
// @access: private
// @route: POST /api/auth/validateToken 
const validateToken = (req) => {
    if (!req.cookies || !req.cookies.BVS) {
        throw new Error('Unauthorized: Token missing');
    }
    const token = req.cookies.BVS;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.voterId = decoded.voterId;
    return decoded
}

module.exports = {login, logout, getMe, validateToken};