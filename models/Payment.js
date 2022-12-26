const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	numberOfTickets: {
		type: Number,
		required: true,
	},
	ticketPrice: {
		type: Number,
		required: true,
	},
	player: {
		type: mongoose.Types.ObjectId,
		ref: "Player",
	},
	event: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "Event",
	},
	status: {
		type: String,
	},
	paymentId: {
		type: String,
		required: true,
	},
	swishRequest: {
		id: String,
		payeePaymentReference: String,
		paymentReference: String,
		callbackUrl: String,
		payerAlias: String,
		payeeAlias: String,
		amount: Number,
		currency: String,
		message: String,
		status: String,
		dateCreated: Date,
		datePaid: Date,
		errorCode: String,
		errorMessage: String,
	},
});

const model = new mongoose.model("Payment", schema);

module.exports = { model, schema };
