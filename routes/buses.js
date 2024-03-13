const express = require("express");
const router = express.Router();

const busesController = require("../controlers/bus")

router.post("/bus", busesController.createBusInfo);
router.get("/buses", busesController.getBusesInfo);

module.exports = router;