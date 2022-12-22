const express = require("express");
const router = express.Router();

const Organisation = require("../../models/Organisation");

router.get("/", (req, res) => {
	Organisation.model
		.findById(req.org_id)
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
