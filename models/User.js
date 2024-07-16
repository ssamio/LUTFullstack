const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

//Model for application user
let userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  adminStatus: {
    type: Boolean,
    default: false,
  },
  budget: {
    type: Number,
    required: false,
    default: 0,
  },
});
//Pre-hook for hashing the password
userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

module.exports = mongoose.model("User", userSchema, "users");

