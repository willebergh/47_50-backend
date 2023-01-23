require("dotenv").config();

const mongoose = require("mongoose");
const Event = require("./models/Event");
const Organisation = require("./models/Organisation");

function initDatabse(callback) {
	console.log("Connecting to database...");
	mongoose
		.connect(process.env.MONGODB_CONNECTION_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("Connected to database successfully!");
			callback();
		})
		.catch((e) => {
			console.log("Could not connect to databse!");
			console.log("Terminating...");
			process.exit(1);
		});
}

initDatabse(async () => {
	const organisation = "63c14a4e2dc2b28de811243c";
	const newEvents = [
		{
			displayName: "John Doe",
			startDate: "2022-05-01T10:00:00Z",
			endDate: "2022-05-05T16:00:00Z",
			ticketPrice: 50,
			organisation,
		},
		{
			displayName: "Jane Smith",
			startDate: "2022-06-01T09:00:00Z",
			endDate: "2022-06-03T17:00:00Z",
			ticketPrice: 35,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
		{
			displayName: "Event Name",
			startDate: "2022-07-01T08:00:00Z",
			endDate: "2022-07-04T20:00:00Z",
			ticketPrice: 25,
			organisation,
		},
	];

	try {
		const newEventDocs = await Event.model.create(newEvents);
		const newEventIds = newEventDocs.map((x) => x._id);

		await Organisation.model.updateOne(
			{
				_id: organisation,
			},
			{
				$push: { event: newEventIds },
			}
		);

		console.log("Success");
		process.exit(0);
	} catch (err) {
		console.log("An error acurred");
		console.error(err);
		process.exit(1);
	}
});
