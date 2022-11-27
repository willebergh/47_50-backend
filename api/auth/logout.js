const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
	req.session = null;
	res.status(200).json({ message: "success" });
});

module.exports = router;
