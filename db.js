const mongoose = require("mongoose");
mongoURI =
  "mongodb+srv://Garvit:" +
  process.env.PASSWORD +
  "@cluster0.6cndibr.mongodb.net/LostAndFound";
const connectToMongo = () => {
  mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
    console.log("Connected to MongoDB");
  });
};
module.exports = connectToMongo;
