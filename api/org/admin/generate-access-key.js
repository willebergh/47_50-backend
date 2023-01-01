const express = require("express");
const Organisation = require("../../../models/Organisation");
const OrgAccessKey = require("../../../models/OrgAccessKey");
const reqOrgAdmin = require("../../../middleware/reqOrgAdmin");
const logger = require("../../../utils/logger");
const uuid = require("uuid");

const router = express.Router();

router.post("/", reqOrgAdmin, async (req, res) => {
	try {
		const { org_id } = req.body;
		const orgDoc = await Organisation.model.findById(org_id);
		if (!orgDoc) throw "org-not-found";

		const newUUID = uuid.v4();
		await OrgAccessKey.model.create({
			orgId: org_id,
			key: newUUID,
		});

		res.status(200).json({ message: "success", accessKey: newUUID });
	} catch (err) {
		logger.error("API @ /api/org/generate-access-key", err);
		res.status(500).json({ message: "error", error: err });
		return;
	}
});

module.exports = router;
