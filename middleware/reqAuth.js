require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use((req, res, next) => {
	const token = req.session.token;

	if (!token) {
		return res.status(401).json({ message: "unauthorized" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return console.error(err);

		if (!decoded) return res.status(401).json({ message: "unauthorized" });

		req.session.user_id = decoded.user._id;

		next();
	});
});

module.exports = router;
