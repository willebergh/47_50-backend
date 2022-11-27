const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	tel: {
		type: "string",
		required: true,
		uniqe: true,
	},
	tickets: [{ type: mongoose.ObjectId, ref: "Ticket" }],
});

const model = new mongoose.model("Player", schema);

module.exports = { model, schema };
