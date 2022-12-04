const express = require("express");

const Player = require("../../models/Player");
const Event = require("../../models/Event");
const Ticket = require("../../models/Ticket");

const router = express.Router();

router.get("/", (req, res) => {
	const { event_id, playerTelefonNumber } = req.body;

	console.log("Swish Success!");
	console.log(req.body);
});

module.exports = router;
