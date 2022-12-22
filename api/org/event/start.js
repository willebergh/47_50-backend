const express = require("express");
const Event = require("../../../models/Event");
const logger = require("../../../utils/logger");
const useOrgMiddleware = require("../../../middleware/useOrg");
const router = express.Router();

/**
 * Add functions for starting an event inadvnace of startDate
 */
router.post("/", useOrgMiddleware, (req, res) => {
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

module.exports = router;
