const logger = require("../utils/logger.js");
const userStore = require("../models/user-store.js");
const trends = require("../controllers/trends.js");
//const trends = require("./trends");
const users = {
    async index(request, response) {
        //const userdata = await userStore.getAllUsers();
        const userId = request.session.user_id
        const userdata = await userStore.getAllUsersWithFollowingStatus(userId);
        const trending = await trends.getTrendingHashtags();
        logger.info("Users rendering");

        response.render("users", {userdata, isIndexPage:false, trending:trending, title:"Trends für dich"});
    },
};

module.exports = users;
