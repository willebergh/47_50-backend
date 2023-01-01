require("dotenv").config();

const express = require("express");
const reqAuthMiddleware = require("../../middleware/reqAuth");
const OrgAccessKey = require("../../models/OrgAccessKey");
const Organisation = require("../../models/Organisation");
const User = require("../../models/User");
const logger = require("../../utils/logger");
const router = express.Router();

router.post("/", reqAuthMiddleware, async (req, res) => {
	const { accessKey } = req.body;
	const user_id = req.session.user_id;

	try {
		const orgAccessKeyDoc = await OrgAccessKey.model.findOne({
			key: accessKey,
		});
		if (!orgAccessKeyDoc) throw "invalid-key";

		const orgDoc = await Organisation.model
			.findById(orgAccessKeyDoc.orgId)
			.select("displayName");
		if (!orgDoc) throw "org-not-found";

		const userDoc = await User.model.findById(user_id);
		if (!userDoc) throw "user-not-found";

		const userAlreadyHasAccess = userDoc.organisations.some(
			(x) => x.toString() === orgAccessKeyDoc.orgId.toString()
		);
		if (userAlreadyHasAccess) throw "user-already-has-access";

		userDoc.organisations.push(orgAccessKeyDoc.orgId);

		await userDoc.save();
		await orgAccessKeyDoc.remove();

		res.status(200).json({ message: "success", organisation: orgDoc });
	} catch (err) {
		logger.error("API @ /api/user/add-organisation", err);
		res.status(500).json({ message: err });
		return;
	}
});

module.exports = router;
