const mongoose = require("mongoose");

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
		default: false,
	},
	hasEnded: {
		type: mongoose.Schema.Types.Boolean,
		requierd: true,
		default: false,
	},
	winner: {
		type: mongoose.ObjectId,
		ref: "Player",
	},
	stats: {
		ticketsSold: {
			type: Number,
			default: 0,
		},
		grossIncome: {
			type: Number,
			default: 0,
		},
		pricePool: {
			type: Number,
			default: 0,
		},
		uniqePlayers: {
			type: Number,
			default: 0,
		},
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

schema.post("find", async function (res) {
	const query = this.getQuery();

	const list = query._id?.$in.map((x) => x.toString());
	if (list) {
		list.forEach(async (_id) => {
			await model.findOneAndUpdate(
				{ _id },
				{
					$set: {},
				}
			);
		});
	}
});

const model = mongoose.model("Event", schema);

module.exports = { model, schema };
