const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  address: String,
  location: String,
  photos: [String],   // store file paths
  videos: [String],   // store file paths
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
