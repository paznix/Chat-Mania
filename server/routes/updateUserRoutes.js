const express = require("express");
const router = express.Router();
const { updateUserDetails } = require("../controllers/updateUserController");

router.post("/", updateUserDetails);

module.exports = router;
