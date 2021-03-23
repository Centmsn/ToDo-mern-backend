const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  notes: [
    {
      type: mongoose.Types.ObjectId,
      default: [],
      ref: "Note",
    },
  ],
  removedNotes: [
    {
      type: mongoose.Types.ObjectId,
      default: [],
      ref: "removedNote",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
