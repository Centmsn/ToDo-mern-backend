const { Router } = require("express");

const NotesController = require("../controllers/NotesController");

const router = Router();

// get note by ID
router.get("/", NotesController.getNotes);

// get notes by user ID
router.get("/user/:id", NotesController.getNotesByUserId);

// create new note
router.post("/", NotesController.postNote);

// delete note by id
router.delete("/:id", NotesController.deleteNoteById);

module.exports = router;
