const getNote = async (req, res, next) => {
  console.log(req.params.id);
  res.json({ message: "OK" });
};

const postNote = async (req, res, next) => {
  console.log("notes OK");
  res.json({
    message: "POST NOTE",
  });
};

exports.getNotes = getNote;
exports.postNote = postNote;
