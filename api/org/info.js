const express = require("express");
const Organisation = require("../../models/Organisation");

const router = express.Router();

router.get("/", (req, res) => {
	Organisation.model
		.findById(req.org_id)
		.populate("event")
		.exec((err, doc) => {
			if (err) return console.error(err);
			console.log(doc);
			res.status(200).json(doc);
		});
});

module.exports = router;
