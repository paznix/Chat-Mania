const express=require("express");
const router=express.Router();
const imageController = require("../controllers/imageController")
const upload = require("../utils/upload");

router.post("/file/upload", upload.single("file"), imageController.uploadFileChat);
router.get("/file/:filename", imageController.setImage);

module.exports = router;