const logger = require("../utils/logger.js");
const otherStore = require("../models/other-store.js");
const home = {
  async index(request, response) {
    const posts = await otherStore.getAllOthers();

    logger.info("home rendering");

    response.render("index", { posts, isIndexPage:true });
  },
};

module.exports = home;
