require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const https = require("https");
const fs = require("fs");
const autoRouter = require("@willebergh/auto-router");

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
app.use(cookieParser());
app.use(
	session({
		secret: "asdklhaöljkfhaöldshahdöjahjskdhjklahsdjköhaösjdhahdkja",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

// app.use("/api", api);

app.use(
	autoRouter({
		routes: "./api", // Path to the directory with all routes
		logging: "verbose", // How much to log to the console
		baseRoute: "/api", // The base route of the autoRouter
	})
);

const PORT = process.env.PORT | 5001;
https
	.createServer(
		{
			key: fs.readFileSync("key.pem"),
			cert: fs.readFileSync("cert.pem"),
		},
		app
	)
	.listen(PORT, (e) => {
		if (e) return console.error(e);
		console.log(`Server has started on port ${PORT} online`);
	});
