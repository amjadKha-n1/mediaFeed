const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller')
router.get('/create-post', async (req, res) => {
    res.render('./post/create-post', { hideNavbar: false });
});

router.post('/create-post', postController.createPost);

router.get('/post/comment', async (req, res) => {
    res.render('./post/comment', { hideNavbar: false });
});
router.get('/post/:id/comment', postController.showAllComments);

router.post('/posts/:id/comment', postController.addComment);

router.post('/post/:id/like', postController.addLike);

router.get('/post/:id/likes', postController.showAllLikes)

module.exports = router;
