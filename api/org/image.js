const express = require("express");
const router = express.Router();

const Organisation = require("../../models/Organisation");
const useOrgMiddleware = require("../../middleware/useOrg");

router.param("org_id", (req, res, next, org_id) => {
	req.org_id = org_id;
	next();
});

router.get("/:org_id", useOrgMiddleware, (req, res) => {
	const org_id = req.org_id;

	Organisation.model
		.findById(org_id)
		.select("+image")
		.exec((err, doc) => {
			if (err) {
				logger.error("API @ /org/info", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			const imageData = doc.image.split(",")[1];
			const image = Buffer.from(imageData, "base64");

			res.writeHead(200, {
				"Content-Type": "image/png",
				"Content-Length": image.length,
			});

			res.end(image);
		});
});

module.exports = router;
