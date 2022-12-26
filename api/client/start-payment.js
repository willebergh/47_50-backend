const express = require("express");
const logger = require("../../utils/logger");
const Swish = require("../../utils/swish");
const Event = require("../../models/Event");
const Payment = require("../../models/Payment");

const router = express.Router();

router.post("/", async (req, res) => {
	const { event_id, numberOfTickets } = req.body;

	try {
		const event_doc = await Event.model.findById(event_id);

		if (event_doc.hasEnded) throw "event has ended";
		if (!event_doc.hasStarted) throw "event has not started";

		const amount = event_doc.ticketPrice * numberOfTickets;

		const paymentRequest = await Swish.createSwishRequest({
			amount,
			message: `Köp ${numberOfTickets} st lotter för ${amount}:-`,
		});

		await Payment.model.create({
			paymentId: paymentRequest.paymentId,
			ticketPrice: event_doc.ticketPrice,
			numberOfTickets,
			event: event_id,
		});

		res.status(200).json({
			message: "success",
			paymentId: paymentRequest.paymentId,
		});
	} catch (err) {
		logger.debug("API @ /client/start-payment", err);
		res.status(400).json({ message: err });
	}
});

module.exports = router;
