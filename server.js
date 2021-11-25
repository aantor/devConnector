const express = require("express");
const mongoose = require("mongoose");
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());

// Connect Database
connectDB()

app.get("/", (req, res) => {
  res.send("Server working 🔥");
});


const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port port 🔥`);




