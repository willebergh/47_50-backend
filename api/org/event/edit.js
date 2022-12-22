const express = require("express");
const Event = require("../../../models/Event");
const logger = require("../../../utils/logger");
const useOrgMiddleware = require("../../../middleware/useOrg");

const router = express.Router();

/**
 * Apply new changes to an already existent event
 */

router.post("/", useOrgMiddleware, (req, res) => {
	const { event_id, displayName, startDate, endDate, ticketPrice } = req.body;

	if (!event_id) {
		res.status(500).json({ message: "missing event_id" });
		return;
	}

	Event.model.findById(event_id, (err, doc) => {
		if (err) {
			logger.error("API @ /org/event/edit", err);
			res.status(500).json({ message: "internal-server-error" });
			return;
		}

		doc.displayName = displayName;

		if (!doc.hasStarted) {
			doc.startDate = startDate;
			doc.ticketPrice = ticketPrice;
		}

		if (!doc.hasEnded) {
			doc.endDate = endDate;
		}

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

module.exports = router;
