const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const reqAuthMiddleware = require("../../middleware/reqAuth");

router.get("/", reqAuthMiddleware, (req, res) => {
	const user_id = req.session.user_id;

	User.model
		.findById(user_id)
		.populate("organisations")
		.exec((err, user_doc) => {
			if (err) return console.error(err);

			res.status(200).json({ message: "success", user: user_doc });
		});
});

module.exports = router;
