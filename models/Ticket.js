const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	event: {
		type: mongoose.ObjectId,
		ref: "Event",
		required: true,
	},
	organisation: {
		type: mongoose.ObjectId,
		ref: "Organisation",
		require: true,
	},
	player: {
		type: mongoose.ObjectId,
		ref: "Player",
		required: true,
	},
});

schema.pre("remove", function (callback) {
	callback();
});

const model = new mongoose.model("Ticket", schema);

class TicketClass {
	constructor({ id, event }) {
		this.id = id;
		this.event = event;
	}
}

module.exports = { TicketClass, model, schema };
