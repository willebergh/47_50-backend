const express = require("express");
const Organisation = require("../../../models/Organisation");
const reqOrgAdminMiddleware = require("../../../middleware/reqOrgAdmin");
const logger = require("../../../utils/logger");

const router = express.Router();

router.post("/", reqOrgAdminMiddleware, async (req, res) => {
	const { org_id, user_id } = req.body;

	try {
		if (!user_id) throw "user-id-not-found";

		await Organisation.model.updateOne(
			{ _id: org_id },
			{
				$pull: { admins: user_id },
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
