require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cookieSession = require("cookie-session");
const api = require("./api/api");

// Connect to database
mongoose
	.connect(process.env.MONGODB_CONNECTION_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to database successfully!"))
	.catch((e) => console.error(e));

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(
	cookieSession({
		name: "session",
		keys: ["asjdalskjdhalskjdhalsjkdhalksjhd"],
		maxAge: 60 * 60 * 1000,
	})
);
app.use("/api", api);

app.listen(process.env.PORT | 5000, (e) => {
	if (e) return console.error(e);
	console.log("Server online");
});
