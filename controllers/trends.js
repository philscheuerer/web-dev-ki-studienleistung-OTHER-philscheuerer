const otherStore = require('../models/other-store');

const trends = {
    async getTrendingHashtags(req, res) {
        try {
            const others = await otherStore.getAllOthers();
            const hashtags = {};

            others.forEach(other => {
                // Annahme, dass Hashtags mit # markiert sind
                const matches = other.content.match(/#\w+/g);

                if (matches) {
                    matches.forEach(hashtag => {
                        if (hashtags[hashtag]) {
                            hashtags[hashtag]++;
                        } else {
                            hashtags[hashtag] = 1;
                        }
                    });
                }
            });
            const trending = Object.entries(hashtags).sort((a, b) => b[1] - a[1]).slice(0, 5);

            return trending;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};

module.exports = {
    getTrendingHashtags: trends.getTrendingHashtags
};
