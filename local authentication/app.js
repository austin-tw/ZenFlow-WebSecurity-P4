require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/userAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

////////Routes/////////
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server 
running on port ${PORT}`)
);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
