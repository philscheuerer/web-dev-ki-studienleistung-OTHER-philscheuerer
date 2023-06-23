const userStore = require("../models/user-store.js");

const follow = {
    async follow(request, response) {
        const followerId = request.session.user_id;
        const followingId = request.params.id;
        console.log("followerId: "+followerId+"\n followingId: "+followingId);
        await userStore.addFollow(followerId, followingId);

        response.redirect('/users');
    },

    async unfollow(request, response) {
        const followerId = request.session.user_id;
        const followingId = request.params.id;

        await userStore.removeFollow(followerId, followingId);

        response.redirect('/users');
    }
};

module.exports = follow;
