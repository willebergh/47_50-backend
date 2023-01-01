const express = require("express");
const Event = require("../../models/Event");
const Organisation = require("../../models/Organisation");
const useOrgMiddleware = require("../../middleware/useOrg");
const router = express.Router();

router.param("org_id", (req, res, next, org_id) => {
	req.org_id = org_id;
	next();
});

router.get("/:org_id", useOrgMiddleware, async (req, res) => {
	const { org_id } = req.params;

	try {
		const orgDoc = await Organisation.model.findById(org_id);

		const onGoingEventDocList = await Event.model.find({
			organisation: orgDoc._id,
			hasStarted: true,
			hasEnded: false,
		});

		const unPaidEventNotFinished = onGoingEventDocList.reduce(
			(partialSum, nextEventDoc) =>
				partialSum + nextEventDoc.stats.pricePool,
			0
		);

		const completedEventDocList = await Event.model.find({
			organisation: orgDoc._id,
			hasEnded: true,
			isOrganisationPaid: false,
		});

		const balance = completedEventDocList.reduce(
			(partialSum, nextEventDoc) =>
				partialSum + nextEventDoc.stats.pricePool,
			0
		);

		res.status(200).json({
			message: "success",
			balance,
			unPaidEventNotFinished,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "error", error: err });
	}
});

module.exports = router;
