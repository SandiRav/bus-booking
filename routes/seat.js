const express = require("express");
const router = express.Router();

const busesController = require("../controlers/seat")

router.post("/seat", busesController.createSeat);

module.exports = router;