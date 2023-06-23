const logger = require("../utils/logger.js");
const userStore = require('../models/user-store');

const searchController = {
    async search(request, response) {
        const title = request.body.searchTerm;
        const userId = request.session.user_id;

        try {
            const searchResults = await userStore.searchUsers(title, userId);

            const viewData = {
                userdata: searchResults,
            };
            console.log("Rendering search results");
            response.render('search', viewData);
        } catch (err) {
            console.error(err);
            response.status(500).send('Server error');
        }
    },
};

module.exports = searchController;
