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

const getSwishRequest = (paymentToken) =>
	new Promise((resolve, reject) => {
		client
			.get(
				`https://mss.cpc.getswish.net/swish-cpcapi/api/v1/paymentrequests/${paymentToken}`
			)
			.then((res) => {
				if (res.status === 200) {
					resolve(res.data);
				}
				reject(res);
			})
			.catch((err) => {
				reject(err.response);
				console.log(err.response);
			});
	});

const createSwishRequest = ({ amount, message }) =>
	new Promise((resolve, reject) => {
		const data = {
			callbackUrl: "https://localhost:5001/api/client/purchase-success",
			payeeAlias: "1231181189",
			currency: "SEK",
			amount,
			message,
		};

		client
			.post(
				`https://mss.cpc.getswish.net/swish-cpcapi/api/v1/paymentrequests`,
				data
			)
			.then((response) => {
				const { status, headers } = response;

				if (status === 201) {
					const { paymentrequesttoken, location } = headers;

					const locationList = location.split("/");
					const paymentId = locationList[locationList.length - 1];

					console.log(
						`Payment request created: token:${paymentrequesttoken} uuid:${paymentId}`
					);

					resolve({
						paymentToken: paymentrequesttoken,
						paymentId,
					});
				}
			})
			.catch((err) => {
				reject(err);
			});
	});

module.exports = { createSwishRequest, getSwishRequest };
