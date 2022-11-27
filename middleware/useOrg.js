const express = require("express");
const reqAuth = require("./reqAuth");
const User = require("../models/User");

const router = express.Router();

router.use(reqAuth, (req, res, next) => {
	const targetOrgId = req.org_id;

	User.model.findById(req.session.user_id, (err, user_doc) => {
		if (err) return console.error(err);

		if (!user_doc.organisations.find((x) => x.toString() === targetOrgId)) {
			return res.status(401).json({ message: "unauthorized" });
		}

		next();
	});
});

module.exports = router;
