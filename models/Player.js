const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	tel: {
		type: "string",
		required: true,
		uniqe: true,
	},
	tickets: [{ type: mongoose.ObjectId, ref: "Ticket" }],
	eventWins: [{ type: mongoose.ObjectId, ref: "Event" }],
	winnings: {
		type: Number,
		default: 0,
	},
});

const model = new mongoose.model("Player", schema);

module.exports = { model, schema };
