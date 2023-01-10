require("dotenv").config();

const express = require("express");
const reqOrgAdmin = require("../../../middleware/reqOrgAdmin");
const RegisterKey = require("../../../models/RegisterKey");
const Organisation = require("../../../models/Organisation");
const User = require("../../../models/User");
const logger = require("../../../utils/logger");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", reqOrgAdmin, async (req, res) => {
	const { email: newUserEmail, organisations, org_id } = req.body;
	const sessionUserId = req.session.user_id;

	try {
		const userDocByNewEmail = await User.model.findOne({
			email: newUserEmail,
		});
		if (userDocByNewEmail) throw "email-already-exists";

		const foundOrgList = await Organisation.model.find(
			{
				_id: { $in: organisations },
				admins: { $in: sessionUserId },
			},
			{ _id: true, displayName: true }
		);

		if (foundOrgList.length === 0) throw "orgs-not-found";

		const newRegisterKey = new RegisterKey.model();

		const token = jwt.sign(
			{ registerKeyId: newRegisterKey._id },
			process.env.JWT_SECRET
		);

		newRegisterKey.token = token;
		newRegisterKey.email = newUserEmail;
		newRegisterKey.organisations = foundOrgList;

		await newRegisterKey.save();

		res.status(200).json({ message: "success", keyDoc: newRegisterKey });
	} catch (err) {
		logger.error("API @ /api/admin/generate-register-key", err);
		res.status(500).json({ message: "error", error: err });
	}
});

module.exports = router;
