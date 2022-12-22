require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const logger = require("../../utils/logger");

const router = express.Router();

router.post("/", (req, res) => {
	const { email, password } = req.body;

	User.model
		.findOne({ email })
		.select("+password")
		.populate({
			path: "organisations",
			model: "Organisation",
			select: ["displayName", "_id"],
		})
		.exec((err, doc) => {
			console.log("1");
			if (err) {
				logger.error("API @ /auth/login", err);
				res.status(500).json({ message: "internal-server-error" });
				return;
			}

			// If no document was found the user does not exsist
			if (!doc) return res.status(401).json({ message: "unauthorized" });
			console.log("2");
			bcrypt.compare(password, doc.password, (err, isMatch) => {
				if (err) {
					logger.error("API @ /auth/login", err);
					res.status(500).json({ message: "internal-server-error" });
					return;
				}
				console.log("3");

				// If the password don't match the hash it's the wrong password.
				if (!isMatch)
					return res.status(401).json({ message: "unauthorized" });

				console.log("4");
				const user = {
					_id: doc._id,
					email: doc.email,
					displayName: doc.displayName,
					organisations: doc.organisations,
				};

				var token = jwt.sign({ user }, process.env.JWT_SECRET);
				req.session.token = token;
				console.log("5");

				res.status(200).json({
					message: "success",
					user,
				});
			});
		});
});

module.exports = router;
