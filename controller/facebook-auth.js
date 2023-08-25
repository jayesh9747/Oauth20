const express = require('express');
const router = express.Router();
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const {logOut} = require('./control');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
},
    async function (accessToken, refreshToken, profile, cb) {
        const user = await User.findOne({
            ProfileId: profile.id,
            issuer: 'facebook',
        });

        if (!user) {
            const user = new User({
                ProfileId: profile.id,
                username: profile.displayName,
                email: "jay",
                issuer: profile.provider,
            });
            await user.save();
            
        } else {
            console.log('Facebook User already exist in Db..')
        }
        return cb(null, profile);
    }

));


router.get('/auth/facebook', passport.authenticate('facebook'))

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
}), async (req, res) => {
    return res.redirect('/dashboard')
})

router.get('/logout',logOut);



module.exports = router;