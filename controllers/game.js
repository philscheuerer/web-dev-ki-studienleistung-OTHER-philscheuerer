const logger = require("../utils/logger.js");

const game = {
    index(request, response) {
        logger.info("Game rendering");
        const viewData = {};
        response.render("game", viewData);
    },
};

module.exports = game;