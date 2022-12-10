const router = require("express").Router();

const { uploadImg, deleteImg } = require("../controllers/imageControler");

router.post("/uploadImg", uploadImg);
router.post("/deleteImg", deleteImg);

module.exports = router;
