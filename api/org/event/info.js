const express = require("express");
const Event = require("../../../models/Event");
const logger = require("../../../utils/logger");
const useOrgMiddleware = require("../../../middleware/useOrg");

const router = express.Router();

router.param("org_id", (req, res, next, org_id) => {
	req.org_id = org_id;
	next();
});

router.param("event_id", (req, res, next, event_id) => {
	req.event_id = event_id;
	next();
});

/**
 * Route for getting information on a specific event
 */
router.get("/all", useOrgMiddleware, (req, res) => {
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

router.get("/:org_id/:event_id", useOrgMiddleware, (req, res) => {
	const { org_id, event_id } = req.params;

	Event.model
		.findById(event_id)
		.populate("activeTickets", "winner")
		.exec((err, event_doc) => {
			if (err) {
				logger.error("API @ /org/event/info/:event_id", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			res.status(200).json({ message: "success", event: event_doc });
		});
});

module.exports = router;
