const userstore = require("../models/user-store.js");
const logger = require("../utils/logger.js");

const accounts = {
    login(request, response) {
        const viewData = {
            title: "Login to the Service"
        };
        response.render("login", viewData);
    },

    logout(request, response) {
        request.session.destroy();
        response.redirect("/");
    },

    signup(request, response) {
        const viewData = {
            title: "Signup for the Service"
        };
        response.render("signup", viewData);
    },

    async register(request, response) {
        const user = request.body;
        await userstore.addUser(user);
        logger.info("Registering user", user);
        response.redirect("/");
    },

    async authenticate(request, response) {
        console.log("User "+request.body.name + " tried to login with password " + request.body.password + "!");
        let user = await userstore.authenticateUser(request.body.name, request.body.password);
        if (user) {
            console.log("user: "+ user.id)
            request.session.user_id = user.id;
            logger.info("User successfully authenticated and added to session", user);
            response.redirect("/dashboard");
        } else {
            response.redirect("/login");
        }
    },

    async getCurrentUser(request) {
        const user = request.session.user;
        return await userstore.getUserById(user);
    }
};

module.exports = accounts;
