const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
   image:{
      type:String,
   }
});

const empcollection = new mongoose.model("empcollection", empSchema);
module.exports = empcollection;
