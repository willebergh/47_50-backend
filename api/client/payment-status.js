const express = require("express");
const logger = require("../../utils/logger");
const swish = require("../../utils/swish");

const router = express.Router();

router.post("/", async (req, res) => {
	const { paymentId } = req.body;

	try {
		if (!paymentId) throw "missing information in req.body";

		const swishRequest = await swish.getSwishRequest(paymentId);

		res.status(200).json({
			message: "success",
			paymentStatus: swishRequest.errorMessage,
		});
	} catch (err) {
		logger.debug("API @ /client/purchase-success", err);
		res.status(400).json({ message: err });
	}
});

module.exports = router;
