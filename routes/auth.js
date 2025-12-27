const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.get('/signup', (req, res) => {
    res.render('./auth/register', { hideNavbar: true });
});
router.post('/signup', authController.signUp);


router.get('/login', (req, res) => {
    res.render('./auth/login', { hideNavbar: true });
});
router.post('/login', authController.logIn);

router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            return res.status(500).send("Couldn't log out. Try Again!")
        }
    })
    res.redirect('/login')
})

module.exports = router;