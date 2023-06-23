const express = require("express");
const router = express.Router();

const home = require("./controllers/home.js");
const users = require("./controllers/users.js");
const dashboard = require("./controllers/dashboard.js");
const accounts = require("./controllers/accounts.js");
const profile = require("./controllers/profile.js");
const othern = require("./controllers/othern.js");
const auth = require("./utils/auth.js");
const follow = require("./controllers/follow.js");
const searchController = require('./controllers/search.js');
const trends = require('./controllers/trends');


router.get("/dashboard", auth.protected, dashboard.index);
router.get("/", home.index);
router.get("/users", auth.protected, users.index);
router.get("/logout", auth.protected, accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
//router.get("/profile", auth.protected, profile.index);
router.get("/profile/:id?", auth.protected, profile.index);

router.get("/othern", auth.protected, othern.showForm);
router.post("/handleSubmission", auth.protected, othern.handleSubmission);
router.post('/follow/:id', auth.protected, follow.follow);
router.post('/unfollow/:id', auth.protected, follow.unfollow);
router.post('/search', searchController.search);
router.post("/profile/uploadProfilePicture", auth.protected, profile.uploadProfilePicture);

router.get('/game', (req, res) => {
    res.render('game', { layout: false, isIndexPage: false });
});


router.get('/signup', (req, res) => {
    res.render('signup', { isIndexPage: true });
});
router.get('/login', (req, res) => {
    res.render('login', { isIndexPage: true });
});


module.exports = router;
