const express = require("express");
const reqAuthMiddleware = require("../../middleware/reqAuth");
const User = require("../../models/User");
const logger = require("../../utils/logger");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/", reqAuthMiddleware, async (req, res) => {
	const { newPassword, oldPassword } = req.body;

	try {
		if (!newPassword || !oldPassword)
			throw "missing new password in req.body";

		const user_id = req.session.user_id;
		const userDoc = await User.model.findById(user_id).select("+password");

		const isOldPasswordCorrect = bcrypt.compareSync(
			oldPassword,
			userDoc.password
		);
		if (!isOldPasswordCorrect) throw "incorrect-password";

		if (oldPassword === newPassword) throw "password-already-in-use";

		const newPasswordHash = bcrypt.hashSync(newPassword, 10);
		userDoc.password = newPasswordHash;

		await userDoc.save();

		res.status(200).json({ message: "success" });
	} catch (err) {
		logger.error("API @ /api/user/change-password", err);
		res.status(500).json({ message: "error", error: err });
		return;
	}
});

module.exports = router;
