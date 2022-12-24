const express = require("express");
const Event = require("../../../models/Event");
const Player = require("../../../models/Player");
const Ticket = require("../../../models/Ticket");
const logger = require("../../../utils/logger");
const calcEventStats = require("../../../utils/calcEventStats");
const useOrgMiddleware = require("../../../middleware/useOrg");

const router = express.Router();

/**
 * End an event. Draw winner and continue.
 */

router.post("/", useOrgMiddleware, async (req, res) => {
	const { event_id } = req.body;

	try {
		const event_doc = await Event.model.findById(event_id).populate([
			{
				path: "activeTickets",
			},
			{
				path: "organisation",
			},
		]);

		if (event_doc.activeTickets.length > 0) {
			const newEventStats = calcEventStats(event_doc);
			const eventStats = newEventStats.getStats();
			const winner = newEventStats.getWinner();

			event_doc.stats = eventStats;
			event_doc.winner = winner._id;

			event_doc.organisation.wallet += eventStats.pricePool;
			await event_doc.organisation.save();

			await Player.model.updateOne(
				{ _id: winner },
				{
					$push: { eventWins: event_id },
					$inc: { winnings: eventStats.pricePool },
				}
			);
		}

		event_doc.activeTickets.forEach(async (ticket) => {
			await Player.model.updateMany(
				{},
				{
					$pull: { tickets: ticket._id.toString() },
				}
			);

			await ticket.remove();
		});

		//event_doc.hasEnded = true;
		event_doc.activeTickets = [];
		await event_doc.save();

		res.status(200).json({ message: "success", event: event_doc });
	} catch (err) {
		logger.error("API @ /org/event/end", err);
		res.status(500).json({ message: "internal-server-error" });
	}
});

module.exports = router;
