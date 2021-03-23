const { Router } = require("express");

const Auth = require("../middlewares/Auth");
const NotesController = require("../controllers/NotesController");

const router = Router();

// get note by ID
router.get("/", Auth, NotesController.getNote);

// get user's history by ID
router.get("/history/user/:id", Auth, NotesController.getHistoryNotesByUserId);

// get notes by user ID
router.get("/user/:id", Auth, NotesController.getNotesByUserId);

// create new note
router.post("/", Auth, NotesController.postNote);

// delete note by id
router.delete("/:id", Auth, NotesController.deleteNoteById);

module.exports = router;
