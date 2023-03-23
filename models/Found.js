const mongoose = require("mongoose");
const lostAndFoundSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  date: String,
  time: String,
  username: String,
});
module.exports = mongoose.model("found", lostAndFoundSchema);
