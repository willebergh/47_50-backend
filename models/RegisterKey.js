const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	token: {
		type: String,
	},
	organisations: {
		type: [{ type: mongoose.Types.ObjectId, ref: "Organisation" }],
		requried: true,
	},
	email: {
		type: String,
		required: true,
	},
});

const model = new mongoose.model("RegisterKey", schema);

module.exports = { schema, model };
