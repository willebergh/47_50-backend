require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const RegisterKey = require("../../models/RegisterKey");
const logger = require("../../utils/logger");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/verify-token", async (req, res) => {
	const { token } = req.body;

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const registerKeyId = decodedToken.registerKeyId;
		const registerKeyDoc = await RegisterKey.model.findById(registerKeyId);

		if (!registerKeyDoc) throw "Could not find registerKey document";

		res.status(200).json({ message: "success", data: registerKeyDoc });
	} catch (err) {
		logger.error("API @ /api/auth/register/verify-token", err);
		res.status(500).json({ message: "error", err });
		return;
	}
});

router.post("/", async (req, res) => {
	const { token, displayName, password } = req.body;

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		if (!decodedToken) throw "unauthorized: could not verify token";

		const registerKeyDoc = await RegisterKey.model.findById(
			decodedToken.registerKeyId
		);
		if (!registerKeyDoc) throw "unauthorized: no registerKeyDoc found";

		const userDoc = await User.model.findOne({
			email: registerKeyDoc.email,
		});
		if (userDoc) throw "email already exists";

		const hash = bcrypt.hashSync(password, 10);

		await User.model.create({
			displayName,
			password: hash,
			email: registerKeyDoc.email,
			organisations: registerKeyDoc.organisations,
		});

		await registerKeyDoc.remove();

		res.status(200).json({ message: "success" });
	} catch (err) {
		logger.error("API @ /auth/register", err);
		res.status(500).json({ message: err });
		return;
	}
});

module.exports = router;
