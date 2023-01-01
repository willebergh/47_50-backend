const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	orgId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	key: {
		type: String,
		required: true,
		uniqe: true,
	},
});

const model = new mongoose.model("OrgAccessKey", schema);

module.exports = { schema, model };
