const express = require("express");
const Event = require("../../../models/Event");
const logger = require("../../../utils/logger");
const useOrgMiddleware = require("../../../middleware/useOrg");

const router = express.Router();

router.post("/", useOrgMiddleware, (req, res) => {
	const { event_id } = req.body;

	Event.model.findById(event_id, (err, doc) => {
		if (err) {
			logger.error("API @ /org/event/delete", err);
			res.status(500).json({ message: "internal-server-error" });
			return;
		}

		if (doc.hasStarted || doc.hasEnded) {
			logger.error(
				"API @ /org/event/delete",
				"Kan inte tabort event som har startat eller avslutats!"
			);
			res.status(400).json({
				message:
					"Kan inte tabort event som har startat eller avslutats!",
			});
			return;
		}

		Event.model.findByIdAndDelete(event_id, (err) => {
			if (err) {
				logger.error("API @ /org/event/delete", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			res.status(200).json({ message: "success" });
		});
	});
});

module.exports = router;
