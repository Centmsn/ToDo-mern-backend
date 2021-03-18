const User = require("../models/User");
const Note = require("../models/Note");
const HttpError = require("../models/Error");

const getNote = async (req, res, next) => {
  console.log(req.params.id);
  res.json({ message: "OK" });
};

const getNotesByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let notes = [];

  try {
    notes = await Note.find({ creator: userId }).select("-creator -__v");
  } catch (error) {
    return next(
      new HttpError("Could not find notes for the provided user", 500)
    );
  }

  res.json({ message: "success", notes });
};

const postNote = async (req, res, next) => {
  const { noteTitle, noteBody, userID } = req.body;

  let user;
  try {
    user = await User.findById(userID);
  } catch (error) {
    return next(new HttpError("Could not add note to Your account", 500));
  }

  if (!user) {
    return next(new HttpError("User does not exist, try to login again", 500));
  }

  const newNote = new Note({
    title: noteTitle,
    body: noteBody,
    creator: userID,
  });

  let createdNote;
  try {
    createdNote = await newNote.save();
    user.notes.push(newNote);
    await user.save();
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong while creating Your note, please try again later",
        500
      )
    );
  }

  return res.json({
    message: "success",
    note: createdNote,
  });
};

const deleteNoteById = async (req, res, next) => {
  const id = req.params.id;

  let deletedNote;
  try {
    deletedNote = await Note.findByIdAndDelete(id);
  } catch (error) {
    return next(
      new HttpError("Could not delete note, please try again later", 500)
    );
  }

  res.json({ message: "success", note: deletedNote });
};

exports.getNotes = getNote;
exports.postNote = postNote;
exports.getNotesByUserId = getNotesByUserId;
exports.deleteNoteById = deleteNoteById;
