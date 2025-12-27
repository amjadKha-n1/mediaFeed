const User = require("../models/user");
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect("/profile");
    }
    const imagePath = "/uploads/profiles/" + req.file.filename;

    await User.findByIdAndUpdate(req.session.user.id, {
      profileImage: imagePath,
    });
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.redirect("/profile");
  }
};

exports.showProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).send("User not found");
    }
    res.render("user/profile", {
      profileUser: currentUser,
      currentUser: currentUser,
      hideNavbar: false
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.showUserProfile = async (req, res) => {
    try {
        const profileUser = await User.findOne({ username: req.params.username });
        if (!profileUser) {
            return res.status(404).send("User Not found!");
        }
        const currentUser = await User.findById(req.session.user.id);
        res.render('user/profile', { profileUser, currentUser, hideNavbar: false });
    } catch (err) {
        console.error(err);
        res.redirect('/feed');
    }
}
exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.redirect("/feed");
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (currentUser.following.includes(targetUser)) {
      return res.redirect(`/profile/${targetUser.username}`);
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.redirect(`/profile/${targetUser.username}`);
  } catch (err) {
    console.error(err);
    res.redirect("/feed");
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const targetUserId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.redirect(`/profile/${targetUser.username}`);
  } catch (err) {
    console.error(err);
    return res.redirect("/feed");
  }
};
