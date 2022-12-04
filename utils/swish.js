const fs = require("fs");
const https = require("https");
const axios = require("axios");
const path = require("path");

const agent = new https.Agent({
	cert: fs.readFileSync(path.join(__dirname, "../ssl/public.pem"), {
		encoding: "utf8",
	}),
	key: fs.readFileSync(path.join(__dirname, "../ssl/private.key"), {
		encoding: "utf8",
	}),
	ca: fs.readFileSync(path.join(__dirname, "../ssl/Swish_TLS_RootCA.pem"), {
		encoding: "utf8",
	}),
});

const client = axios.create({
	httpsAgent: agent,
});

const getSwishRequest = (paymentToken) => {
	client
		.get(
			`https://mss.cpc.getswish.net/swish-cpcapi/api/v1/paymentrequests/${paymentToken}`
		)
		.then((res) => {
			console.log(res.data);
		})
		.catch((err) => {
			//console.log(err.response);
		});
};

const createSwishRequest = async ({ amount, message }, callback) => {
	const data = {
		callbackUrl: "https://localhost:5001/api/callback/purchaseSuccess",
		payeeAlias: "1231181189",
		currency: "SEK",
		amount,
		message,
	};

	try {
		const response = await client.post(
			`https://mss.cpc.getswish.net/swish-cpcapi/api/v1/paymentrequests`,
			data
		);
		const { status, headers } = response;

		if (status === 201) {
			const { paymentrequesttoken, location } = headers;

			const locationList = location.split("/");
			const paymentUUID = locationList[locationList.length - 1];

			console.log(
				`Payment request created: token:${paymentrequesttoken} uuid:${paymentUUID}`
			);

			callback(null, paymentUUID);
		}
	} catch (err) {
		callback(err, null);
	}
};

module.exports = { createSwishRequest };
