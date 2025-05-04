const express = require('express');
const router = express.Router();

const { saveElection, getElection, getAllElections } = require("../controllers/electionController");
router.route("/save").post(saveElection);
router.route("/:id").get(getElection);
router.route("/all").get(getAllElections);

module.exports = router;