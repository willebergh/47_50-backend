const Event = require("../models/Event");
const Organisation = require("../models/Organisation");

module.exports = async (org, callback) => {
	try {
		const orgDoc =
			typeof org === "string"
				? await Organisation.model.findById(org)
				: org;

		const onGoingEventDocList = await Event.model.find({
			organisation: orgDoc._id,
			hasStarted: true,
			hasEnded: false,
		});

		const finishedEventDocList = await Event.model.find({
			organisation: orgDoc._id,
			hasEnded: true,
			isOrganisationPaid: false,
		});

		const unPaidEventNotFinished = onGoingEventDocList.reduce(
			(partialSum, nextEventDoc) =>
				partialSum + nextEventDoc.stats.pricePool,
			0
		);

		const balance = finishedEventDocList.reduce(
			(partialSum, nextEventDoc) =>
				partialSum + nextEventDoc.stats.pricePool,
			0
		);

		orgDoc.wallet = {
			balance: balance ? balance : 0,
			unPaidEventNotFinished: unPaidEventNotFinished
				? unPaidEventNotFinished
				: 0,
		};

		await orgDoc.save();
		return callback(null, orgDoc);
	} catch (err) {
		console.error(err);
		return callback(err, null);
	}
};
