const mongoose = require("mongoose");

const schema = mongoose.Schema;
const BusesSchema = new schema({
  destination: { type: String, required: true },
  departureTime:{ type: Number, required: true },
  driverName: { type: String, required: true },
  driverContact: { type: String, required: true },
  estimatedDuration: { type: String, required: true },
  breaks: { type: String, required: true },
  price: { type: Number, required: true },
  seats: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seat' }]
});

module.exports = mongoose.model("Bus", BusesSchema);
