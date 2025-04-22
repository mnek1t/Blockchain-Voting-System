const express = require('express');
const router = express.Router();

const { login, logout, validateToken } = require("../controllers/authController");
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/validateToken").post(validateToken);

module.exports = router;