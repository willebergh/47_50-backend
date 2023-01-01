const express = require("express");
const reqOrgAdmin = require("../../../middleware/reqOrgAdmin");
const Organisation = require("../../../models/Organisation");
const User = require("../../../models/User");
const logger = require("../../../utils/logger");

const router = express.Router();

router.param("org_id", (req, res, next, org_id) => {
	req.org_id = org_id;
	next();
});

router.get("/:org_id", reqOrgAdmin, async (req, res) => {
	const { org_id } = req.params;

	try {
		const orgDoc = await Organisation.model.findById(org_id);
		const userDocs = await User.model
			.find({
				organisations: { $in: orgDoc._id },
			})
			.select(["displayName", "email", "_id"]);

		const newList = userDocs.map((doc) => ({
			displayName: doc.displayName,
			email: doc.email,
			_id: doc._id,
			isOrgAdmin: orgDoc.admins.some(
				(x) => x.toString() === doc._id.toString()
			),
		}));

		res.status(200).json({ message: "success", data: newList });
	} catch (err) {
		logger.error("API @ /api/org/admin/user-list", err);
		res.status(500).json({ message: "error", error: err });
		return;
	}
});

module.exports = router;
