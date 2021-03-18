const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", NoteSchema);
