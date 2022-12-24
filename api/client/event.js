const express = require("express");
const logger = require("../../utils/logger");
const Event = require("../../models/Event");

const router = express.Router();

router.get("/:event_id", (req, res) => {
	const { event_id } = req.params;

	if (!event_id) {
		logger.debug("API @ /player/event", "Inget event_id finns");
		res.status(400).json({ message: "no event_id" });
		return;
	}

	Event.model
		.findById(event_id)
		.populate({
			path: "organisation",
			model: "Organisation",
			select: ["displayName", "color", "image"],
		})
		.exec((err, doc) => {
			if (err) {
				logger.debug("API @ /player/event", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			if (!doc) {
				logger.debug("API @ /player/event", "event finns inte");
				res.status(400).json({ message: "event not found" });
				return;
			}

			const newEventDoc = {
				displayName: doc.displayName,
				startDate: doc.startDate,
				endDate: doc.endDate,
				ticketPrice: doc.ticketPrice,
				_id: doc._id,
				hasStarted: doc.hasStarted,
				hasEnded: doc.hasEnded,
				isReadyToStart: doc.isReadyToStart,
				pricePool: doc.stats.pricePool,

				organisation: doc.organisation.displayName,
				color: doc.organisation.color,
				image: doc.organisation.image,
			};

			res.status(200).json({ message: "success", event: newEventDoc });
		});
});

module.exports = router;
