require("dotenv").config();
const moment = require("moment");

const logger = {
	message: (origin, message) => {
		console.log(origin, message);
	},
	error: (origin, error) => {
		console.error(origin, error);
	},
	debug: (origin, message) => {
		if (process.env.DEBUG) {
			console.log(origin, message);
		}
	},
};

module.exports = logger;
