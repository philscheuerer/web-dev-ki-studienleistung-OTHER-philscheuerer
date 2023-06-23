
/* Much better approach but needs superuser rights!

const fs = require('fs');
const { Client } = require('pg');
const dotenv = require("dotenv");
dotenv.config();


async function importData() {
    const connectionString = process.env.DB_CONNECTION_STRING;
    const client = new Client({ connectionString });
    await client.connect();

    const filePath = 'users.csv';

    const query = `
    COPY users(user_id, name, password, birthday, profile_pic, bio_text, created)
    FROM '${filePath}'
    DELIMITER ','
    CSV HEADER;
  `;

    try {
        await client.query(query);
        console.log('Daten erfolgreich importiert.');
    } catch (error) {
        console.error('Fehler beim Importieren der Daten:', error);
    } finally {
        await client.end();
    }
}

importData();
*/


const fs = require("fs");
const csv = require("csv");

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const pool = new Pool({ connectionString: process.env.DB_CON_STRING });
//db_con_string in clear text because sometimes the connection via .env did not work
//const pool = new Pool({connectionString:"postgres://scp34787:secret@hera.hs-regensburg.de:5432/scp34787"});
const import_users = async () => {
    const parser = fs.createReadStream("users.csv").pipe(csv.parse());

    for await (const record of parser) {
        const [user_id, name, password, birthday, profile_pic, bio_text, created] = record;
        console.log(name);

        // Insert the record into the "users" table
        await pool.query(
            "INSERT INTO users (user_id, name, password, birthday, profile_pic, bio_text, created) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [user_id, name, password, birthday, profile_pic, bio_text, created]
        );
    }

    console.log("Data import users completed.");
};

(async () => {
    try {
        await import_users();
    } catch (error) {
        console.error("Fehler beim Importieren der Daten für users:", error);
    } finally {
        pool.end();
    }
})();

const import_others = async () => {
    const parser = fs.createReadStream("others.csv").pipe(csv.parse());

    for await (const record of parser) {
        const [post_id, user_id, text, created] = record;
        console.log(text);

        // Insert the record into the "users" table
        await pool.query(
            "INSERT INTO others (post_id, user_id, text, created) VALUES ($1, $2, $3, $4)",
            [post_id, user_id, text, created]
        );
    }

    console.log("Data import others completed.");
};

(async () => {
    try {
        await import_others();
    } catch (error) {
        console.error("Fehler beim Importieren der Daten für others:", error);
    } finally {
        pool.end();
    }
})();

