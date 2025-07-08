require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "https://zerodha-dashboard-rosy.vercel.app", // Your production frontend
      "http://localhost:3000" // For local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(bodyParser.json());

// Route to get all holdings
app.get("/api/holdings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json({ success: true, data: allHoldings });
  } catch (error) {
    console.error("Error fetching holdings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to get all positions
app.get("/api/positions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json({ success: true, data: allPositions });
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new OrdersModel(req.body);
    await newOrder.save();
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Connect to MongoDB and start the server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
