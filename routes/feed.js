const express = require('express');
const router = express.Router();

const feedController = require('../controllers/feed-controller');

router.get('/', (req, res) => {
    res.redirect('/feed');
});

router.get('/feed', feedController.showAllPosts);

router.get('/mediaFeed', (req, res) => {
    res.render('./main/main', { hideNavbar: false });
})


module.exports = router;