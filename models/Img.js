const mongoose = require("mongoose");
var imageSchema = new mongoose.Schema({
  name: String,
  email: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});
module.exports = mongoose.model("img", imageSchema);
