const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	displayName: {
		type: "string",
		required: true,
	},
	color: {
		type: "string",
		default: "#3ff668",
	},
	image: {
		type: String,
		select: false,
	},
	event: [{ type: mongoose.ObjectId, ref: "Event" }],
	admins: [{ type: mongoose.ObjectId, ref: "User" }],
});

const model = new mongoose.model("Organisation", schema);

/**
 * Class to an organistion
 */

class OrganistionClass {
	constructor(data) {
		this.id = data.id;
		this.event = data.event;
		this.email = data.email;
		this.password = data.password;
		this.displayName = data.displayName;
		this.bank_account = data.bank_account;
	}
}

module.exports = { OrganistionClass, model, schema };
