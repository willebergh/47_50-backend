const express = require("express");
const logger = require("../utils/logger");
const Event = require("../models/Event");
const Player = require("../models/Player");
const Ticket = require("../models/Ticket");

const router = express.Router();

router.get("/event/:event_id", (req, res) => {
	const { event_id } = req.params;

	if (!event_id) {
		logger.debug("API @ /player/event", "Inget event_id finns");
		res.status(400).json({ message: "no event_id" });
		return;
	}

	Event.model
		.findById(event_id)
		.populate("organisation")
		.exec((err, doc) => {
			if (err) {
				logger.debug("API @ /player/event", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			const newEventDoc = {
				displayName: doc.displayName,
				startDate: doc.startDate,
				endDate: doc.endDate,
				organisation: doc.organisation.displayName,
				ticketPrice: doc.ticketPrice,
				_id: doc._id,
			};

			res.status(200).json({ message: "success", event: newEventDoc });
		});
});

router.post("/buy-tickets", (req, res) => {
	const { event_id, numberOfTickets, playerTelNr } = req.body;

	if (!event_id || !playerTelNr || !numberOfTickets) {
		logger.debug(
			"API @ /player/buy-tickets",
			"missing information in req.body"
		);
		res.status(400).json({ message: "no event_id or playerTelNr" });
		return;
	}

	Event.model
		.findById(event_id)
		.populate("activeTickets")
		.populate("organisation")
		.exec((err, event_doc) => {
			if (err) {
				logger.err("API @ /player/buy-tickets", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			if (!event_doc.hasStarted) {
				logger.debug(
					"API @ /player/buy-tickets",
					"Kan inte köpa tickets innan eventet har startat"
				);
				res.status(400).json({ message: "event has not started" });
				return;
			}

			Player.model.findOne({ tel: playerTelNr }, (err, player_doc) => {
				if (err) {
					logger.err("API @ /player/buy-tickets", err);
					res.status(500).json({ message: "internal-server-error" });
					return;
				}

				var player_doc_var;
				if (!player_doc) {
					Player.model.create({ tel: playerTelNr }, (err, player_doc) => {
						if (err) {
							logger.err("API @ /player/buy-tickets", err);
							res.status(500).json({ message: "internal-server-error" });
							return;
						}
						player_doc_var = player_doc;
					});
				} else {
					player_doc_var = player_doc;
				}

				const newTickets = [];

				for (let x = 0; x < numberOfTickets; x++) {
					newTickets.push({
						event: event_id,
						organisation: event_doc.organisation._id,
						player: player_doc_var._id,
					});
				}

				Ticket.model.insertMany(newTickets, (err, ticket_docs) => {
					if (err) {
						logger.err("API @ /player/buy-tickets", err);
						res.status(500).json({ message: "internal-server-error" });
						return;
					}

					ticket_docs.forEach((t) => {
						event_doc.activeTickets.push(t._id);
						player_doc_var.tickets.push(t._id);
					});

					event_doc.stats = {
						ticketsSold: event_doc.activeTickets.length,
						grossIncome: event_doc.activeTickets.length * event_doc.ticketPrice,
						pricePool:
							(event_doc.activeTickets.length * event_doc.ticketPrice) / 2,
						uniqePlayers: new Set(event_doc.activeTickets.map((x) => x.player))
							.length,
					};

					event_doc.save();
					player_doc_var.save();

					res.status(200).json({ message: "success", tickets: ticket_docs });
				});
			});
		});
});

module.exports = router;
