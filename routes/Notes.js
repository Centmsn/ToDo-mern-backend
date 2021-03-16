const { Router } = require("express");

const NotesController = require("../controllers/NotesController");

const router = Router();

// get place by id
router.get("/:id", NotesController.getNotes);

// create new place
router.post("/:id", NotesController.postNote);

module.exports = router;
