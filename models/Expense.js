const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
    repeating: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Expense", expenseSchema, "expenses");
