const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload')
const userController = require("../controllers/user-controller");

router.post(
  "/profile/upload",
  upload.single("profileImage"),
  userController.uploadProfileImage
);

router.get('/profile', userController.showProfile);
router.get('/profile/:username', userController.showUserProfile);
router.post('/profile/:id/follow', userController.followUser);
router.post('/profile/:id/unfollow', userController.unfollowUser);

module.exports = router;

