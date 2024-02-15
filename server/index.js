const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path")
const app = express();
require('dotenv').config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "500kb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', require('./Routes/route'));

const connectDB = require("./Utils/db");
// connectDB();
if (process.env.NODE_ENV === "dev") {
    //replaced "production" with "dev"
    app.use(express.static("../client/build"));
  
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
    });
  } else {
    app.get("/", (req, res) => {
      res.send("API is running..");
    });
  }
const PORT = process.env.PORT || 80; // Use 3000 if process.env.PORT is not defined

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
