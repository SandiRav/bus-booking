const HttpError = require("../models/httpError");
const Bus = require("../models/buses");

const createBusInfo = async (req, res, next) => {
  const {
    destination,
    departureTime,
    driverName,
    driverContact,
    estimatedDuration,
    breaks,
    price,
  } = req.body;

  const newBus = new Bus({
    destination,
    departureTime,
    driverName,
    driverContact,
    estimatedDuration,
    breaks,
    price,
    seats: [],
  });

  let result;

  try {
    result = await newBus.save();
  } catch (error) {
    const err = new HttpError("Failed to create a bus", 500);
    return next(err);
  }

  res.status(201).json({ bus: newBus.toObject({ getters: true }) });
};

const getBusesInfo = async (req, res, next) => {
  let buses;
  try {
    buses = await Bus.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching buses failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json(buses.map((bus) => bus.toObject({ getters: true })));
};


exports.createBusInfo = createBusInfo;
exports.getBusesInfo = getBusesInfo;
