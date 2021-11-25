const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./config/db")

const app = express()

// Connect Database
connectDB()

// Middleware
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Server working 🔥")
})

// Define Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))

const port = process.env.PORT || 5000

app.listen(port, () => `Server running on port port 🔥`)
