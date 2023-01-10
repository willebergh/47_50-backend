const express = require("express");
const Organisation = require("../../models/Organisation");
const logger = require("../../utils/logger");
const multer = require("multer");
const useOrgMiddleware = require("../../middleware/useOrg");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/", useOrgMiddleware, upload.single("image"), (req, res) => {
	const { org_id, displayName, color } = req.body;
	console.log(req.body);

	Organisation.model.findById(org_id, (err, doc) => {
		if (err) {
			logger.error("API @ /org/edit", err);
			res.status(500).json({ message: "internal-server-error" });
			return;
		}

		doc.displayName = displayName;
		doc.color = color;

		if (req.file) {
			const toBase64 = (arr) =>
				btoa(
					arr.reduce(
						(data, byte) => data + String.fromCharCode(byte),
						""
					)
				);

			const imageBuffer = req.file?.buffer;
			doc.image = "data:image/png;base64," + toBase64(imageBuffer);
		}

		doc.save((err, newDoc) => {
			res.status(200).json({ message: "success", org: newDoc });
		});
	});
});

module.exports = router;
