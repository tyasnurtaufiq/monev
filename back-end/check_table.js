const pool = require('./db.js');

async function checkTable() {
    try {
        const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tahun_anggaran'
    `);
        console.log('Columns:', res.rows.map(r => r.column_name));
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkTable();
