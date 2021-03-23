const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RemovedSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("removedNote", RemovedSchema);
