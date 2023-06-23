const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const userStore = {
    async addUser(user) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const query = 'INSERT INTO users (name, password, birthday, profile_pic, created) VALUES ($1, $2, $3, $4, $5)';
        const values = [user.name, user.password, user.birthday, "default", formattedDate];
        try {
            console.log("Tried to register with data: " + values);
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error adding user", e);
        }
    }
    ,
    async authenticateUser(name, password) {
        const query = 'SELECT * FROM users WHERE name=$1 AND password=$2';
        const values = [name, password];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            if (dbRes.rows[0] !== undefined) {
                console.log("Login successful.");
                // Return the actual id of the user
                return {id: dbRes.rows[0].user_id};
            } else {
                console.log("Login unsuccessful.")
                return undefined;
            }
        } catch (e) {
            console.log("Error authenticating user", e);
        }
    },
    async getUserById(id) {
        logger.info(`Getting user ${id}`);
        const query = 'SELECT * FROM users WHERE user_id=$1';
        const values = [id];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            logger.info(`Getting user ${dbRes.rows[0].user_id}`);
            if (dbRes.rows[0] !== undefined) {
                return {user_id: dbRes.rows[0].user_id, name: dbRes.rows[0].name, profile_pic: dbRes.rows[0].profile_pic, birthday:dbRes.rows[0].birthday, created:dbRes.rows[0].created, bio_text:dbRes.rows[0].bio_text};
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error getting user", e);
        }
    },
    async getAllUsers(){
        logger.info("Getting all users...")
        const query = "SELECT * FROM users";
        try{
            let dbRes = await dataStoreClient.query(query);
            if(dbRes.rows[0] !== undefined){
                const userdata = dbRes.rows.map(row => ({
                    image: row.profile_pic,
                    name: row.name,
                }));
                console.log(userdata);
                return userdata;
            }
            else{
                return undefined;
            }
        }catch(e){
            console.log("Error getting all users", e);
        }
    },
    async countFollowing(userId) {
        const query = 'SELECT COUNT(*) FROM Follows WHERE follower_id=$1';
        const values = [userId];

        try {
            let result = await dataStoreClient.query(query, values);
            return parseInt(result.rows[0].count);
        } catch (e) {
            console.error("Error counting following", e);
        }
    },

    async countFollowers(userId) {
        const query = 'SELECT COUNT(*) FROM Follows WHERE following_id=$1';
        const values = [userId];

        try {
            let result = await dataStoreClient.query(query, values);
            return parseInt(result.rows[0].count);
        } catch (e) {
            console.error("Error counting followers", e);
        }
    },


    async addFollow(followerId, followingId) {
        const query = 'INSERT INTO Follows (follower_id, following_id) VALUES ($1, $2)';
        const values = [followerId, followingId];

        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            console.error("Error adding follow", e);
        }
    },

    async removeFollow(followerId, followingId) {
    const query = 'DELETE FROM Follows WHERE follower_id=$1 AND following_id=$2';
    const values = [followerId, followingId];

    try {
        await dataStoreClient.query(query, values);
    } catch (e) {
        console.error("Error removing follow", e);
    }
},

async isFollowing(followerId, followingId) {
    const query = 'SELECT * FROM Follows WHERE follower_id=$1 AND following_id=$2';
    const values = [followerId, followingId];

    try {
        const result = await dataStoreClient.query(query, values);
        return result.rows.length > 0;
    } catch (e) {
        console.error("Error checking follow status", e);
    }
},

    async getAllUsersWithFollowingStatus(followerId) {
        const query = `
        SELECT u.*, f.follower_id IS NOT NULL as following
        FROM users u
        LEFT JOIN follows f ON f.following_id = u.user_id AND f.follower_id = $1 ORDER BY u.name ASC
    `;
        const values = [followerId];

        try {
            const dbRes = await dataStoreClient.query(query, values);
            if(dbRes.rows[0] !== undefined){
                const userdata = dbRes.rows.map(row => ({
                    id: row.user_id,
                    image: row.profile_pic,
                    name: row.name,
                    following: row.following
                }));
                return userdata;
            } else{
                return undefined;
            }
        } catch(e) {
            console.error("Error getting all users with following status", e);
        }
    },
    async searchUsers(searchTerm, currentUserId) {
        const query = "SELECT user_id, name, profile_pic FROM Users WHERE name ILIKE $1 AND user_id != $2";
        const values = [`%${searchTerm}%`, currentUserId];
        console.log(`Searching for users with term "${searchTerm}" and excluding user id ${currentUserId}`);

        try {
            let result = await dataStoreClient.query(query, values);
            const userdata = result.rows.map(row => ({
                id: row.user_id,
                name: row.name,
                image: row.profile_pic
            }));
            return userdata;
        } catch (e) {
            console.error("Error searching users", e);
        }
    },
    async updateProfilePicture(userId, imagePath) {
        const query = 'UPDATE Users SET profile_pic = $1 WHERE user_id = $2';
        const values = [imagePath, userId];

        try {
            await dataStoreClient.query(query, values);
            console.log(`Profile picture updated for user ${userId}`);
        } catch (e) {
            console.error("Error updating profile picture", e);
        }
    }

};

module.exports = userStore;
