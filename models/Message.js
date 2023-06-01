const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  time: String,
  date: String,
});
module.exports = mongoose.model("message", messageSchema);
