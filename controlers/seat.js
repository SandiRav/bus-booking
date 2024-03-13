const HttpError = require("../models/httpError");
const Bus = require("../models/buses");
const Seat = require("../models/seat");

const createSeat = async (req, res, next) => {
  const {
    isAvailable,
    passengerFirstName,
    passengerLastName,
    passengerPhoneNumber,
    extraLuggage,
    bus,
  } = req.body;

  const newSeat = new Seat({
    isAvailable,
    passengerFirstName,
    passengerLastName,
    passengerPhoneNumber,
    extraLuggage,
    bus,
  });

  let busInfo;

  try {
    busInfo = await Bus.findById(bus);
  } catch (error) {
    const err = new HttpError("Failed to find a bus", 404);
    return next(err);
  }

  if (!busInfo) {
    const error = new HttpError("Bus doesn't exist", 500);
    next(error);
  }

  try {
    await newSeat.save();
    busInfo.seats.push(newSeat);
    await busInfo.save();
  } catch (err) {
    const error = new HttpError("Creating seat failed, please try again.", 500);
    return next(error);
  }

  res.json(busInfo);
};

exports.createSeat = createSeat;
