const logger = require("../utils/logger.js");
const otherStore = require("../models/other-store.js");
const trends = require("../controllers/trends.js");
const dashboard = {
    async index(request, response) {
        const posts = await otherStore.getAllFollowedOthers(request.session.user_id);
        const trending = await trends.getTrendingHashtags();
        logger.info("dashboard rendering");

        response.render("dashboard", { posts, isIndexPage:false, isDashboardPage:true, trending:trending, title:"Trends für dich"});
    },
};

module.exports = dashboard;
