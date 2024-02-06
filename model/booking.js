const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  itemId: [
    {
      _id: {
        type: ObjectId,
        ref: "item",
      },
      price: {
        type: number,
        required: true,
      },
      night: {
        type: number,
        required: true,
      },
    },
  ],
  memberId: [
    {
      type: ObjectId,
      ref: "Member",
    },
  ],
  bankId: [
    {
      type: ObjectId,
      ref: "Bank",
    },
  ],
  proofPayment: {
    type: String,
    required: true,
  },
  bankFrom: {
    type: String,
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
