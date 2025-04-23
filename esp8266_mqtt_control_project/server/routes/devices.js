const express = require("express");
const router = express.Router();
const Device = require("../models/Device");
const ControlLog = require("../models/ControlLog");

router.get("/user/:userId", async (req, res) => {
  const devices = await Device.find({ userId: req.params.userId });
  res.json(devices);
});

router.post("/control-log", async (req, res) => {
  const log = new ControlLog(req.body);
  await log.save();
  res.json({ message: "Log saved" });
});

module.exports = router;
