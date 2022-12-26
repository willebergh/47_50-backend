const express = require("express");
const logger = require("../../utils/logger");
const calcEventStats = require("../../utils/calcEventStats");
const Event = require("../../models/Event");
const Player = require("../../models/Player");
const Ticket = require("../../models/Ticket");
const Payment = require("../../models/Payment");
const swish = require("../../utils/swish");

const router = express.Router();

router.post("/", async (req, res) => {
	const { paymentId } = req.body;

	try {
		if (!paymentId) throw "missing information in req.body";

		const swishRequest = await swish.getSwishRequest(paymentId);
		const payment_doc = await Payment.model.findOne({ paymentId });

		if (!payment_doc) {
			throw "payment not found";
		}

		payment_doc.swishRequest = swishRequest;

		if (swishRequest.status === "ERROR") {
			throw swishRequest.errorMessage;
		}
		if (swishRequest.status === "CANCELLED") {
			throw swishRequest.errorMessage;
		}
		if (swishRequest.status === "DECLINED") {
			throw swishRequest.errorMessage;
		}

		if (swishRequest.status === "PAID") {
			const event_doc = await Event.model
				.findById(payment_doc.event)
				.populate([
					{
						path: "activeTickets",
					},
					{
						path: "organisation",
					},
				]);

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
			player_doc = await Player.model.findOne({
				tel: swishRequest.payerAlias,
			});

			if (!player_doc) {
				player_doc = await Player.model.create({
					tel: swishRequest.payerAlias,
				});
			}

			payment_doc.player = player_doc._id;

			const newTickets = Array.apply(
				null,
				Array(payment_doc.numberOfTickets)
			).map(() => ({
				event: payment_doc.event._id,
				organisation: event_doc.organisation._id,
				player: player_doc._id,
			}));

			const ticket_docs = await Ticket.model.insertMany(newTickets);

			ticket_docs.forEach((ticket) => {
				event_doc.activeTickets.push(ticket);
				player_doc.tickets.push(ticket);
			});

			event_doc.stats = calcEventStats(event_doc).getStats();

			await event_doc.save();
			await player_doc.save();
			await payment_doc.save();

			res.status(200).json({ message: "success" });
		}
	} catch (err) {
		logger.debug("API @ /client/purchase-success", err);
		res.status(400).json({ message: err });
	}
});

module.exports = router;
