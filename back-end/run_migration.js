const fs = require('fs');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const sql = fs.readFileSync(path.join(__dirname, 'migration_split_monitoring.sql'), 'utf8');

pool.query(sql)
    .then(() => {
        console.log('Migration successful');
        process.exit(0);
    })
    .catch(err => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
