require("dotenv").config();

const express = require("express");
const reqAdmin = require("../../middleware/reqAdmin");
const RegisterKey = require("../../models/RegisterKey");
const Organisation = require("../../models/Organisation");
const User = require("../../models/User");
const logger = require("../../utils/logger");

const router = express.Router();

router.post("/", reqAdmin, async (req, res) => {
	const { displayName, admins } = req.body;

	try {
		if (!displayName) throw "no displayName";
		if (admins.length < 0) throw "no admins";

		const newOrgDoc = await Organisation.model.create({
			displayName,
			admins,
		});

		await User.model.updateMany(
			{ _id: { $in: admins } },
			{ $push: { organisations: newOrgDoc._id } }
		);

		console.log(newOrgDoc);

		res.status(200).json({ message: "success", org: newOrgDoc });
	} catch (err) {
		logger.error("API @ /api/admin/generate-register-key", err);
		res.status(500).json({ message: "error", err });
	}
});

module.exports = router;
