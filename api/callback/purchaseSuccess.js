const express = require("express");

const Player = require("../../models/Player");
const Event = require("../../models/Event");
const Ticket = require("../../models/Ticket");

const router = express.Router();

router.post("/", (req, res) => {
	const { event_id, playerTelefonNumber } = req.body;

	

	
});

module.exports = router;
