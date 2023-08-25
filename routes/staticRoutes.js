const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render("login.ejs");
});

router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('dashboard.ejs', { user: req.user }),
            { user: req.user }
    }
    return res.redirect('/login');
})

module.exports = router;