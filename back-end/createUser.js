const bcrypt = require("bcrypt");
const pool = require("./db");

async function createUser() {
    try {
        const username = "admin";
        const name = "Administrator";
        const password = "20@Pril1997";
        const role = "admin";

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (username, name, password, role)
             VALUES ($1,$2,$3,$4)`,
            [username, name, hashedPassword, role]
        );

        console.log("User berhasil dibuat");
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createUser();