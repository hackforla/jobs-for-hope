const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const jobs = require("./routes/api/jobs");
const orgs = require("./routes/api/organizations");

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static("public"));

// Use Routes
app.use("/api/jobs", jobs);
app.use("/api/orgs", orgs);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
