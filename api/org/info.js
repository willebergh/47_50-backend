const express = require("express");
const Organisation = require("../../models/Organisation");

const router = express.Router();

router.get("/", (req, res) => {
	Organisation.model
		.findById(req.org_id)
		.select("+image")
		.populate("event")
		.exec((err, doc) => {
			if (err) return console.error(err);
			res.status(200).json({ message: "success", org: doc });
		});
});

module.exports = router;
