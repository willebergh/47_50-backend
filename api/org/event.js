const express = require("express");
const Organisation = require("../../models/Organisation");
const Event = require("../../models/Event");
const Player = require("../../models/Player");
const Ticket = require("../../models/Ticket");
const moment = require("moment");
const logger = require("../../utils/logger");

const router = express.Router();

/**
 * Route for getting information on a specific event
 */
router.get("/info/all", (req, res) => {
	const org_id = req.session.org_id;
	Event.model
		.find()
		.where("organisation")
		.in([org_id])
		.populate("activeTickets")
		.exec((err, event_docs) => {
			if (err) {
				logger.error("API @ /org/event/info/all", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			res.status(200).json({ message: "success", events: event_docs });
		});
});

router.get("/info/:event_id", (req, res) => {
	const { event_id } = req.params;

	Event.model
		.findById(event_id)
		.populate("activeTickets")
		.exec((err, event_doc) => {
			if (err) {
				logger.error("API @ /org/event/info/:event_id", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			res.status(200).json({ message: "success", event: event_doc });
		});
});

/**
 * Create a new event for current organisation
 */
router.post("/create", (req, res) => {
	const { displayName, startDate, endDate, ticketPrice } = req.body;

	if (!displayName || !startDate || !endDate || !ticketPrice) {
		logger.debug("API @ /org/event/create", "missing info in request");
		res.status(400).json({ message: "missing body data" });
		return;
	}

	Organisation.model.findById(req.org_id, (err, org_doc) => {
		if (err) {
			logger.error("API @ /org/event/create", err);
			res.status(500).json({ message: "internal-server-error" });
			return;
		}

		if (!org_doc) {
			logger.debug("API @ /org/event/create", "Could not find org_doc");
			res.status(400).json({ message: "no org" });
			return;
		}

		const newEvent = {
			displayName,
			ticketPrice,
			startDate,
			endDate,
			organisation: org_doc._id,
			hasStarted: false,
			hasEnded: false,
		};

		// Create event in database
		Event.model.create(newEvent, (err, event_doc) => {
			if (err) {
				logger.error("API @ /org/event/create", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			org_doc.event.push(event_doc._id);
			org_doc.save((err) => {
				if (err) {
					logger.error("API @ /org/event/create", err);
					res.status(500).json({ message: "internal-server-error" });
					return;
				}

				res.status(200).json({ message: "success", event: event_doc });
			});
		});
	});
});

/**
 * Add functions for starting an event inadvnace of startDate
 */
router.post("/start", (req, res) => {
	const { event_id } = req.body;

	Event.model.findById(event_id, (err, doc) => {
		if (err) {
			logger.error("API @ /org/event/start", err);
			res.status(500).json({ message: "internal-server-error" });
			return;
		}

		doc.hasStarted = true;
		doc.earlyStart = new Date();
		doc.save((err, doc) => {
			if (err) {
				logger.error("API @ /org/info/event/start", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			res.status(200).json({ message: "success", event: doc });
		});
	});
});

/**
 * Apply new changes to an already existent event
 */

router.post("/edit", (req, res) => {});

/**
 * End an event. Draw winner and continue.
 */

router.post("/end", (req, res) => {
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
					gorssIncome: listOfAllTickets.length * event_doc.ticketPrice,
					pricePool: (listOfAllTickets.length * event_doc.ticketPrice) / 2,
					uniqePlayers: new Set(listOfAllTickets.map((x) => x.player)).length,
				};

				listOfAllTickets.forEach((t) => {
					Player.model.findById(ticket.player, (err, player_doc) => {
						if (err) {
							logger.error("API @ /org/event/end", err);
							res.status(500).json({ message: "internal-server-error" });
							return;
						}

						const newPlayerTickets = [];
						player_doc.tickets.forEach((playerTicket) => {
							if (playerTicket._id !== ticket._id) {
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
							res.status(500).json({ message: "internal-server-error" });
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
