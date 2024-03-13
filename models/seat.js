const mongoose = require("mongoose");

const schema = mongoose.Schema;
const seatSchema = new schema({
  isAvailable: { type: Boolean, required: true },
  passengerFirstName: { type: String, required: true },
  passengerLastName: { type: String, required: true },
  passengerPhoneNumber: { type: String, required: true },
  extraLuggage: { type: Boolean, required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Bus" },
});

module.exports = mongoose.model("Seat", seatSchema);
