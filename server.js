const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./config/db")
const chalk = require('chalk');

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))

app.get("/", (req, res) => {
  res.send("Server working 🔥")
})

// Define Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))

const port = process.env.PORT || 5000

app.listen(port, () => console.log(chalk.bgYellow.black(`Server running at http://127.0.0.1:${port}`)))
