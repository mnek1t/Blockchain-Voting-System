const express = require('express');
const router = express.Router();

const { saveElection, getElectionById, getAllElections } = require("../controllers/electionController");
router.route("/save").post(saveElection);
router.route("/all").get(getAllElections);
router.route("/:id").get(getElectionById);

module.exports = router;