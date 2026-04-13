const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    port: process.env.DB_PORT,
});

const migrationSql = `
    ALTER TABLE output_kegiatan ADD COLUMN IF NOT EXISTS kode VARCHAR(50);
    ALTER TABLE belanja ADD COLUMN IF NOT EXISTS kode VARCHAR(50);
`;

const runMigration = async () => {
    try {
        console.log("Starting migration: Adding 'kode' column to output_kegiatan and belanja...");
        await pool.query(migrationSql);
        console.log("Migration completed successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
};

runMigration();
