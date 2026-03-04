const bcrypt = require("bcrypt");

async function generateHash() {
    const password = "123admin";

    const hash = await bcrypt.hash(password, 10);

    console.log("Password asli:", password);
    console.log("Hasil hash:", hash);
}

generateHash();
