const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	displayName: {
		type: "string",
		required: true,
	},
	email: {
		type: "string",
		required: true,
		uniqe: true,
	},
	password: {
		type: "string",
		required: true,
		select: false,
	},
	organisations: [{ type: mongoose.ObjectId, ref: "Organisation" }],
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

const model = new mongoose.model("User", schema);

module.exports = { schema, model };
