const mongoose = require("mongoose");
const lostAndFoundSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  date: String,
  time: String,
  username: String,
  email: String,
  name: String,
  img1: {
    data: Buffer,
    contentType: String,
  },
  category:String,
});
module.exports = mongoose.model("lost", lostAndFoundSchema);
