const User = require("../models/user");
const Post = require("../models/post");
function timeAgo(date) {

  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  for (const key in intervals) {
    const value = intervals[key];
    const t = Math.floor(seconds / value);
    if (t > 1) {
      return `${t} ${key}s ago`;
    }
    if (t === 1) {
      return `1 ${key} ago`;
    }
  }
  return "just now";
}

exports.showAllPosts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const user = await User.findById(req.session.user.id);
    let posts = await Post.find()
      .populate("user", "username profileImage updatedAt")
      .sort({ createdAt: -1 });
    posts = posts.map((post) => ({
      ...post.toObject(),
      timeAgo: timeAgo(post.createdAt),
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    }));

    res.render("./feed/feed", { posts, user: user, hideNavbar: false });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};
