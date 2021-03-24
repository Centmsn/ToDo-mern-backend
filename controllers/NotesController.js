const mongoose = require("mongoose");

const User = require("../models/User");
const Note = require("../models/Note");
const RemovedNote = require("../models/Removed");
const HttpError = require("../models/Error");

exports.patchNoteById = async (req, res, next) => {
  let note;
  try {
    note = await Note.findById(req.params.id);
  } catch (error) {
    return next(
      new HttpError("Could not find the note, please try again", 500)
    );
  }

  if (!note) {
    return next(new HttpError("Note does not exist", 500));
  }

  if (note.creator.toString() !== req.userId) {
    return next(new HttpError("403 Forbidden", 403));
  }

  const { body, title } = req.body;

  note.title = title;
  note.body = body;

  try {
    await note.save();
  } catch (error) {
    return next(
      new HttpError("Could not update the note, please try again", 500)
    );
  }

  res.status(200).json({ message: "success", note });
};

exports.getHistoryNotesByUserId = async (req, res, next) => {
  let notes;
  try {
    notes = await RemovedNote.find({ creator: req.params.id });
  } catch (err) {
    return next(
      new HttpError("Could not find history notes, please try again", 500)
    );
  }

  let creator;
  try {
    creator = await User.findById(req.userId);
  } catch (error) {
    return next(new HttpError("User not found, please try again", 500));
  }

  if (creator._id.toString() !== req.userId) {
    return next(new HttpError("403 Forbidden", 403));
  }

  res.json({ message: "success", notes });
};

exports.getNotesByUserId = async (req, res, next) => {
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

exports.postNote = async (req, res, next) => {
  const { noteTitle, noteBody } = req.body;

  let user;
  try {
    user = await User.findById(req.userId);
  } catch (error) {
    return next(new HttpError("Could not add note to Your account", 500));
  }

  if (!user) {
    return next(new HttpError("User does not exist, try to login again", 500));
  }

  const newNote = new Note({
    title: noteTitle,
    body: noteBody,
    creator: req.userId,
  });

  let createdNote;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    createdNote = await newNote.save({ session });
    user.notes.push(newNote);
    await user.save({ session });

    await session.commitTransaction();
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

exports.deleteNoteById = async (req, res, next) => {
  const id = req.params.id;

  // find note
  let note;
  try {
    note = await Note.findById(id).populate("creator");
  } catch (error) {
    return next(
      new HttpError("Could not find the note, please try again alter", 500)
    );
  }

  // if note does not exist
  if (!note) {
    return next(new HttpError("Note with the given ID does not exist", 404));
  }

  // find the creator of the note
  let creator;
  try {
    creator = await User.findById(note.creator);
  } catch (error) {
    return next(
      new HttpError("Could not find the user, please try again later", 404)
    );
  }

  // check if creator id matches current user id
  if (note.creator.id !== req.userId) {
    return next(new HttpError("403 forbidden", 403));
  }

  const completedDate = new Date().toISOString();
  const removed = new RemovedNote({
    title: note.title,
    body: note.body,
    date: completedDate,
    creator: req.userId,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    // remove note
    await note.remove({ session });
    await removed.save({ session });
    // remove note from users collection
    note.creator.notes.pull(note);
    // add removed note to the user's history
    note.creator.removedNotes.push(removed);
    await note.creator.save({ session });
    await session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError("Could not delete the note, please try again later", 500)
    );
  }

  res.json({ message: "success" });
};
