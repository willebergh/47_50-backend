const express = require("express");
const logger = require("../../utils/logger");
const calcEventStats = require("../../utils/calcEventStats");
const Event = require("../../models/Event");
const Player = require("../../models/Player");
const Ticket = require("../../models/Ticket");

const router = express.Router();

router.post("/", async (req, res) => {
	const { event_id, numberOfTickets, playerTelNr } = req.body;

	try {
		if (!event_id || !numberOfTickets || !playerTelNr)
			throw "missing information in req.body";

		const event_doc = await Event.model.findById(event_id).populate([
			{
				path: "activeTickets",
			},
			{
				path: "organisation",
			},
		]);

		console.log(event_doc);

		if (!event_doc) {
			throw "event not found";
		}

		if (!event_doc.hasStarted) {
			throw "event has not started";
		}

		if (event_doc.hasEnded) {
			throw "event has ended";
		}

		var player_doc;
		player_doc = await Player.model.findOne({ tel: playerTelNr });

		if (!player_doc) {
			player_doc = await Player.model.create({ tel: playerTelNr });
		}

		const newTickets = [];
		for (let x = 0; x < numberOfTickets; x++) {
			newTickets.push({
				event: event_id,
				organisation: event_doc.organisation._id,
				player: player_doc._id,
			});
		}

		const ticket_docs = await Ticket.model.insertMany(newTickets);

		ticket_docs.forEach((ticket) => {
			event_doc.activeTickets.push(ticket);
			player_doc.tickets.push(ticket);
		});

		event_doc.stats = calcEventStats(event_doc).getStats();

		await event_doc.save();
		await player_doc.save();

		res.status(200).json({ message: "success" });
	} catch (err) {
		logger.debug("API @ /player/buy-tickets", err);
		res.status(400).json({ message: err });
	}
});

module.exports = router;
