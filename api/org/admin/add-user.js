const express = require("express");
const reqOrgAdmin = require("../../../middleware/reqOrgAdmin");
const Organisation = require("../../../models/Organisation");
const User = require("../../../models/User");
const logger = require("../../../utils/logger");

const router = express.Router();

router.post("/", reqOrgAdmin, async (req, res) => {
	const { org_id, email } = req.body;

	try {
		const userDoc = await User.model.findOne({ email });
		if (!userDoc) throw "user-not-found";

		const userAlreadyHasAccess = userDoc.organisations.some(
			(x) => x.toString() === org_id
		);
		if (userAlreadyHasAccess) throw "user-already-has-access";

		userDoc.organisations.push(org_id);
		await userDoc.save();

		res.status(200).json({ message: "success" });
	} catch (err) {
		logger.error("API @ /api/org/admin/add-user", err);
		res.status(500).json({ message: "error", error: err });
		return;
	}
});

module.exports = router;
