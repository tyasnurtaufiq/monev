const pool = require('./db.js');

async function insertTahun() {
    try {
        // Insert 2026
        await pool.query(
            `INSERT INTO tahun_anggaran (tahun) VALUES ($1)`,
            [2026]
        );

        // Insert 2027
        await pool.query(
            `INSERT INTO tahun_anggaran (tahun) VALUES ($1)`,
            [2027]
        );

        console.log(`Successfully added Tahun Anggaran 2026 & 2027.`);
        console.log(`Due to 'ORDER BY tahun DESC' in the API, the frontend will natively default to the highest year (2027), but the instructions say default should be current year (2026). I will fix the frontend right after this.`);
    } catch (err) {
        if (err.code === '23505') {
            console.log('Year already exists, ignoring.');
        } else {
            console.error('Error inserting tahun:', err);
        }
    } finally {
        pool.end();
    }
}

insertTahun();
