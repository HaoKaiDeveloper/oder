const { StatusCodes } = require("http-status-codes");
const fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("file");

const uploadImg = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, err });
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ success: true, url: res.req.file.path });
    }
  });
};

const deleteImg = async (req, res) => {
  let { url } = req.body;
  url = url.slice(7);
  const path = `./uploads/${url}`;
  fs.unlinkSync(path);

  return res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  uploadImg,
  deleteImg,
  upload,
};
