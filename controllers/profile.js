const logger = require("../utils/logger.js");
const otherStore = require("../models/other-store.js");
const userStore = require("../models/user-store.js");
const moment = require("moment/moment");
const profile = {
    async index(request, response) {
        let user, others;
        try {
            // Use the ID from the request parameters, if it exists.
            // If it doesn't exist, use the ID from the session.
            const userId = request.params.id || request.session.user_id;
            console.log(userId);
            if (!userId) {
                response.redirect('/login');
                return;
            }
            user = await userStore.getUserById(userId);
            console.log("Profile user data query successful!");
            others = await otherStore.getOthersByUserId(userId);
            console.log("Profile other data query successful!");
            if (user) {

                let posts_count = others ? others.length : 0;
                logger.info("Profile rendering");
                let following_count = await userStore.countFollowing(userId);
                let followers_count = await userStore.countFollowers(userId);
                console.log(following_count);
                console.log(followers_count);
                const viewData = {
                    name: user.name,
                    birthday: moment(user.birthday).format('DD.MM.YYYY'),
                    created: moment(user.created).format('DD.MM.YYYY') + " um " + moment(user.created).format('HH:mm'),
                    profile_pic: user.profile_pic,
                    bio_text: user.bio_text,
                    posts_count:posts_count,
                    following_count:following_count,
                    followers_count:followers_count,
                    isOwnProfile: userId === request.session.user_id,
                    posts: others
                };
                console.log(viewData);
                response.render("profile", viewData);
            } else {
                response.status(404).send('User not found');
            }
        } catch (err) {
            logger.error(err);
            console.log(user) // Jetzt sollten diese nicht mehr undefiniert sein
            console.log(others)
            response.status(500).send('Server error');
        }
    },

    /*
        async index(request, response) {
            let user, others; // Initialisieren Sie die Variablen hier
            try {
                const userId = request.session.user_id;
                console.log(userId);
                if (!userId) {
                    response.redirect('/login');
                    return;
                }
                user = await userStore.getUserById(userId);
                console.log("Profile user data query successful!");
                others = await otherStore.getOthersByUserId(userId);
                console.log("Profile other data query successful!");
                if (user) {
                    logger.info("Profile rendering");
                    let posts_count = others.length;
                    let following_count = await userStore.countFollowing(userId);
                    let followers_count = await userStore.countFollowers(userId);
                    console.log(following_count);
                    console.log(followers_count);
                    const viewData = {
                        name: user.name,
                        birthday: moment(user.birthday).format('DD.MM.YYYY'),
                        created: moment(user.created).format('DD.MM.YYYY') + " um " + moment(user.created).format('HH:mm'),
                        profile_pic: user.profile_pic,
                        bio_text: user.bio_text,
                        posts_count:posts_count,
                        following_count:following_count,
                        followers_count:followers_count,
                        posts: others
                    };
                    console.log(viewData);
                    response.render("profile", viewData);
                } else {
                    response.status(404).send('User not found');
                }
            } catch (err) {
                logger.error(err);
                console.log(user) // Jetzt sollten diese nicht mehr undefiniert sein
                console.log(others)
                response.status(500).send('Server error');
            }
        },*/
    async uploadProfilePicture(req, res) {
        if (!req.files || !req.files.image) {
            return res.status(400).send('No files were uploaded.');
        }

        const image = req.files.image;
        const uploadPath = 'public/img/users/' + image.name;

        image.mv(uploadPath, async function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Error uploading file.');
            }

            try {
                const userId = req.session.user_id;
                // Assuming userStore.updateProfilePicture updates the picture for the user
                const image_name = image.name.replace(/\.(png|jpeg)$/i, '');
                await userStore.updateProfilePicture(userId, image_name);
                logger.info("Profile picture updated successfully");
                res.redirect('/profile');
            } catch (err) {
                logger.error(err);
                res.status(500).send('Server error');
            }
        });
    }
};

module.exports = profile;
