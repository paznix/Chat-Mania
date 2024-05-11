const express=require('express');
const UserControllers=require('../controllers/UserControllers');
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");

router.route('/').post(UserControllers.registerUser).get(protect,UserControllers.allUsers);
router.post('/login',UserControllers.authUser);
// router.post("/generate-zego-token", UserControllers.authUser, UserControllers.generateZegoToken);
router.route('/generate-zego-token').post(UserControllers.authUser, UserControllers.generateZegoToken)
// router.post("/start-audio-call", protect, UserControllers.startAudioCall);
router.route("/start-audio-call").post( protect, UserControllers.startAudioCall);
router.route("/start-video-call").post(protect, UserControllers.startVideoCall);
router.route("/get-call-logs").get(protect, UserControllers.getCallLogs)

module.exports=router;
