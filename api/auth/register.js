const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const logger = require("../../utils/logger");

const router = express.Router();

router.post("/", (req, res) => {
	const { email, password, displayName } = req.body;

	// Try to find document based on provided email.
	User.model.findOne({ email }, (err, doc) => {
		if (err) {
			logger.error("API @ /auth/register", err);
			res.status(500).json({ message: "internal-server-error" });
			return;
		}

		// If document exists the email is already in use.
		if (doc) {
			logger.debug("API @ /auth/register", "Email is already registerd!");
			res.status(400).json({ message: "email already exists" });
			return;
		}

		// Hash the password for db storage.
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) {
				logger.error("API @ /auth/register", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			// Create new document in database to register user / organisation
			User.model.create({ email, password: hash, displayName }, (err, doc) => {
				if (err) {
					logger.error("API @ /auth/register", err);
					res.status(500).json({ message: "internal-server-error" });
					return;
				}

				res.status(200).json({ message: "success" });
			});
		});
	});
});

module.exports = router;
