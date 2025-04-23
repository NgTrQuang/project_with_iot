const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.post("/control-device", testController.controlDevice);

module.exports = router;
