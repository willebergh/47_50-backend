const express = require("express");
const Event = require("../../../models/Event");
const Player = require("../../../models/Player");
const Ticket = require("../../../models/Ticket");
const logger = require("../../../utils/logger");
const useOrgMiddleware = require("../../../middleware/useOrg");

const router = express.Router();

/**
 * End an event. Draw winner and continue.
 */

router.post("/", useOrgMiddleware, (req, res) => {
	const { event_id } = req.body;
	Event.model
		.findById(event_id)
		.populate("activeTickets")
		.exec((err, event_doc) => {
			if (err) {
				logger.error("API @ /org/event/end", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			const listOfAllTickets = event_doc.activeTickets;
			const length = listOfAllTickets.length;

			if (length > 0) {
				const winnerIndex = Math.round(Math.random() * length);
				const winnerPlayer = listOfAllTickets[winnerIndex].player;

				event_doc.winner = winnerPlayer;
				event_doc.stats = {
					ticketsSold: listOfAllTickets.length,
					gorssIncome:
						listOfAllTickets.length * event_doc.ticketPrice,
					pricePool:
						(listOfAllTickets.length * event_doc.ticketPrice) / 2,
					uniqePlayers: new Set(listOfAllTickets.map((x) => x.player))
						.length,
				};

				listOfAllTickets.forEach((t) => {
					Player.model.findById(t.player, (err, player_doc) => {
						if (err) {
							logger.error("API @ /org/event/end", err);
							res.status(500).json({
								message: "internal-server-error",
							});
							return;
						}

						const newPlayerTickets = [];
						player_doc.tickets.forEach((playerTicket) => {
							if (playerTicket._id !== t._id) {
								newPlayerTickets.push(playerTicket);
							}
						});

						player_doc.tickets = newPlayerTickets;
						player_doc.save();
					});
				});

				Ticket.model.deleteMany(
					{ event: event_doc._id },
					(err, deletedDocs) => {
						if (err) {
							logger.error("API @ /org/event/end", err);
							res.status(500).json({
								message: "internal-server-error",
							});
							return;
						}
					}
				);

				event_doc.activeTickets = [];
			}

			event_doc.hasEnded = true;

			event_doc.save((err, doc) => {
				if (err) {
					logger.error("API @ /org/event/end", err);
					res.status(500).json({ message: "internal-server-error" });
					return;
				}

				res.status(200).json({
					message: "success",
					event: doc,
				});
			});
		});
});

module.exports = router;
