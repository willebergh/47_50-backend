const express = require("express");
const Organisation = require("../../../models/Organisation");
const Event = require("../../../models/Event");
const logger = require("../../../utils/logger");
const useOrgMiddleware = require("../../../middleware/useOrg");

const router = express.Router();

/**
 * Create a new event for current organisation
 */
router.post("/", useOrgMiddleware, (req, res) => {
	const { displayName, startDate, endDate, ticketPrice, org_id } = req.body;

	if (!displayName || !startDate || !endDate || !ticketPrice) {
		logger.debug("API @ /org/event/create", "missing info in request");
		res.status(400).json({ message: "missing body data" });
		return;
	}

	Organisation.model.findById(org_id, (err, org_doc) => {
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

module.exports = router;
