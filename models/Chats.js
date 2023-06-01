const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  user1: String,
  user2: String,
});
module.exports = mongoose.model("chat", chatSchema);
