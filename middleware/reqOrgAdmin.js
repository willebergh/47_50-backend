const express = require("express");
const useOrg = require("./useOrg");
const Organisation = require("../models/Organisation");
const logger = require("../utils/logger");

const router = express.Router();

router.use(useOrg, async (req, res, next) => {
	try {
		const targetOrgId = req.org_id;
		const targetUserId = req.session.user_id;
		const orgDoc = await Organisation.model.findById(targetOrgId);

		if (!orgDoc) throw "Could not find orgId";

		if (orgDoc.admins.find((x) => x.toString() === targetUserId)) {
			return next();
		} else {
			throw "unauthorized: 2";
		}
	} catch (err) {
		logger.error("MIDDLEWARE @ reqOrgAdmin", err);
		res.status(500).json({ message: "error", error: err });
		return;
	}
});

module.exports = router;
