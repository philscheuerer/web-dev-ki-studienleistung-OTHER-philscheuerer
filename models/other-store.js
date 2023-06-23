const dataStore = require("./data-store.js");

const logger = require("../utils/logger.js");
const dataStoreClient = dataStore.getDataStore();
const moment = require('moment');


const otherStore = {
    async addOther(other) {
        const query = 'INSERT INTO others (user_id, text) VALUES ($1, $2)';
        const values = [other.user_id, other.text];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error adding other", e);
        }
    },
    async getOtherById(id) {
        logger.info(`Getting user ${id}`);
        const query = 'SELECT * FROM users WHERE user_id=$1';
        const values = [user_id];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            logger.info(`Getting user ${dbRes.rows[0].user_id}`);
            if (dbRes.rows[0] !== undefined) {
                return {user_id: dbRes.rows[0].user_id, name: dbRes.rows[0].name, profile_pic: dbRes.rows[0].profile_pic};
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error getting user", e);
        }
    },
    async getAllOthers() {
        logger.info("Getting all others...");
        const query = "SELECT o.text, o.created, u.name, u.profile_pic FROM others o JOIN users u ON o.user_id = u.user_id";
        try {
            let dbRes = await dataStoreClient.query(query);
            if (dbRes.rows[0] !== undefined) {
                const otherdata = dbRes.rows.map(row => ({
                    image: row.profile_pic,
                    name: row.name,
                    date: moment(row.created).format('DD.MM.YYYY') + " um " + moment(row.created).format('HH:mm'),
                    content: row.text
                }));
                return otherdata;
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error getting all others", e);
        }
    },
    async getAllFollowedOthers(user_id) {
        logger.info(`Getting posts for followed users by user ${user_id}`);
        const query = `
        SELECT o.text, o.created, u.name, u.profile_pic 
        FROM others o 
        JOIN users u ON o.user_id = u.user_id
        WHERE u.user_id IN (
            SELECT following_id FROM follows WHERE follower_id = $1
        )
    `;
        const values = [user_id];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            if (dbRes.rows[0] !== undefined) {
                const otherdata = dbRes.rows.map(row => ({
                    image: row.profile_pic,
                    name: row.name,
                    date: moment(row.created).format('DD.MM.YYYY') + " um " + moment(row.created).format('HH:mm'),
                    content: row.text
                }));
                console.log(otherdata);
                return otherdata;
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error getting posts for followed users", e);
        }
    },

    async getOthersByUserId(id) {
        logger.info(`Getting posts for user ${id}`);
        const query = "SELECT o.text, o.created, u.name, u.profile_pic FROM others o JOIN users u ON o.user_id = u.user_id WHERE u.user_id = $1";
        const values = [id];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            if (dbRes.rows[0] !== undefined) {
                const otherdata = dbRes.rows.map(row => ({
                    image: row.profile_pic,
                    name: row.name,
                    date: moment(row.created).format('DD.MM.YYYY') + " um " + moment(row.created).format('HH:mm'),
                    content: row.text
                }));
                console.log(otherdata);
                return otherdata;
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error getting posts for user", e);
        }
    }

};

module.exports = otherStore;
