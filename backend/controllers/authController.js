// @desc: Login method for user authentication
// @access: public
// @route: POST /api/auth/login 
const login = async (req, res) => {
    res.status(201).json({
        message: 'Login successful'
    });
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
