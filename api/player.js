const express = require("express");
const logger = require("../utils/logger");
const Event = require("../models/Event");
const Player = require("../models/Player");
const Ticket = require("../models/Ticket");
const Swish = require("../utils/swish");

const router = express.Router();

router.post("/pay-with-swish", (req, res) => {
	Swish.createSwishRequest(
		{
			amount: "100",
			message: `Betala för ${12} st lotter`,
		},
		(err, paymentToken) => {
			if (err) {
				logger.error("API @ /api/player/buy-tickets", err);
				res.status(500).json({
					message: "internal-server-error",
				});
				return;
			}

			res.status(200).json({
				message: "success",
				paymentToken,
			});
		}
	);
});

module.exports = router;
