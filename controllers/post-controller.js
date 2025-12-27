const Post = require("../models/post");
const Comment = require("../models/comment");
exports.createPost = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const newPost = new Post({
    content: req.body.content,
    user: req.session.user.id,
  });
  await newPost.save();
  res.redirect("/feed");
};

exports.showAllComments = async (req, res) => {
  const postId = req.params.id;
  let post = await Post.findById(postId)
    .populate("user", "username")
    .populate({
      path: "comments",
      populate: { path: "user", select: "username" },
    })
    .sort({ createdAt: -1 });
  res.render("./post/comment", { post, hideNavbar: false });
};

exports.addComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user.id;

  const comment = await Comment.create({
    text: req.body.text,
    user: userId,
    post: postId,
  });

  await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
  res.redirect("/feed");
};

exports.addLike = async (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user.id;

  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "post not found!" });
  }
  const alreadyLiked = post.likes.includes(userId);
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();

  res.json({
    likeCount: post.likes.length,
    liked: !alreadyLiked,
  });
};

exports.showAllLikes = async (req, res) => {
  const postId = req.params.id;

  let post = await Post.findById(postId)
    .populate("likes");
  res.render('./post/like', { post, hideNavbar: false })
};
