const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const uuid = require("uuid/v4");
const bcrypt = require("bcrypt-nodejs");

dotenv.config();

const { pool } = require("./services/postgres-pool");
const { passport } = require("./services/passport");

const jobs = require("./routes/api/jobs");
const orgs = require("./routes/api/organizations");
const regions = require("./routes/api/regions");
const auth = require("./routes/api/auth");
const verify = require("./routes/api/verify");
const s3 = require("./routes/api/s3");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    store: new pgSession({
      pool: pool
    }),
    secret: "asdf",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use("/api/jobs", jobs);
app.use("/api/orgs", orgs);
app.use("/api/regions", regions);
app.use("/api/s3", s3);
app.use("/api/auth", auth);
app.use("/api/verify", verify);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static("public"));
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.use((req, res) => {
  res.status(404).send(`<h2>The path ${req.url} not found.</h2>`);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
