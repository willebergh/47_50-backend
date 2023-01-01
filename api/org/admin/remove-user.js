const express = require("express");
const User = require("../../../models/User");

const reqOrgAdminMiddleware = require("../../../middleware/reqOrgAdmin");
const logger = require("../../../utils/logger");

const router = express.Router();

router.post("/", reqOrgAdminMiddleware, async (req, res) => {
	const { org_id, user_id } = req.body;

	try {
		if (!user_id) throw "user-id-not-found";

		await User.model.updateOne(
			{ _id: user_id },
			{
				$pull: { organisations: org_id },
			}
		);

		res.status(200).json({ message: "success" });
	} catch (err) {
		logger.error("API @ /api/org/admin/remove-user", err);
		res.status(500).json({ message: "error", error: err });
		return;
	}
});

module.exports = router;
