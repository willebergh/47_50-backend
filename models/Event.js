const mongoose = require("mongoose");
const Ticket = require("./Ticket");

const schema = new mongoose.Schema({
	displayName: {
		type: mongoose.Schema.Types.String,
		requierd: true,
	},
	startDate: {
		type: mongoose.Schema.Types.Date,
		requierd: true,
	},
	endDate: {
		type: mongoose.Schema.Types.Date,
		requierd: true,
	},
	activeTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
	ticketPrice: {
		type: mongoose.Schema.Types.Number,
		requierd: true,
	},
	qrCode: "string",
	organisation: {
		type: mongoose.ObjectId,
		ref: "Organisation",
		required: true,
	},
	isReadyToStart: {
		type: mongoose.Schema.Types.Boolean,
		required: true,
		default: true,
	},
	hasStarted: {
		type: mongoose.Schema.Types.Boolean,
		requierd: true,
	},
	hasEnded: {
		type: mongoose.Schema.Types.Boolean,
		requierd: true,
	},
	winner: {
		type: mongoose.ObjectId,
		ref: "Player",
	},
	stats: {
		ticketsSold: "number",
		grossIncome: "number",
		pricePool: "number",
		uniqePlayers: "number",
	},
	earlyStart: {
		type: mongoose.Schema.Types.Date,
	},
	earlyEnding: {
		type: mongoose.Schema.Types.Date,
	},
	isWinnerPaid: {
		type: Boolean,
		default: false,
	},
	isOrganisationPaid: {
		type: Boolean,
		default: false,
	},
});

schema.post("remove", (doc) => {
	Ticket.remove({ _id: { $in: doc.activeTickets } });
});

const model = mongoose.model("Event", schema);

module.exports = { model, schema };
