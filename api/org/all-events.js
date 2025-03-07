const express = require("express");
const Organisation = require("../../models/Organisation");
const useOrgMiddleware = require("../../middleware/useOrg");
const router = express.Router();
const logger = require("../../utils/logger");

router.param("org_id", (req, res, next, org_id) => {
	req.org_id = org_id;
	next();
});

router.get("/:org_id", useOrgMiddleware, (req, res) => {
	const { org_id } = req.params;

	Organisation.model
		.findById(org_id)
		.select("event")
		.populate("event")
		.exec((err, doc) => {
			if (err) {
				logger.error("API @ /org/info", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			res.status(200).json({
				message: "success",
				events: doc.event,
			});
		});
});

module.exports = router;
