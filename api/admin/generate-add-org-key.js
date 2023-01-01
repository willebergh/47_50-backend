require("dotenv").config();

const express = require("express");
const reqAdmin = require("../../middleware/reqAdmin");
const RegisterKey = require("../../models/RegisterKey");
const Organisation = require("../../models/Organisation");
const User = require("../../models/User");
const logger = require("../../utils/logger");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", reqAdmin, async (req, res) => {
	const { email, organisations } = req.body;

	try {
		const userDoc = await User.model.findOne({ email });
		if (!userDoc) throw "User does not exist";

		const foundOrgList = await Organisation.model.find(
			{ _id: { $in: organisations } },
			{ _id: true }
		);

		if (foundOrgList.length === 0)
			throw "Could not find any of the provieded orgs";

		const newRegisterKey = new RegisterKey.model();

		const token = jwt.sign(
			{ registerKeyId: newRegisterKey._id },
			process.env.JWT_SECRET
		);

		newRegisterKey.token = token;
		newRegisterKey.email = email;
		newRegisterKey.organisations = foundOrgList;

		await newRegisterKey.save();

		res.status(200).json({ message: "success", keyDoc: newRegisterKey });
	} catch (err) {
		logger.error("API @ /api/admin/generate-add-org-key", err);
		res.status(500).json({ message: "error", err });
	}
});

module.exports = router;
