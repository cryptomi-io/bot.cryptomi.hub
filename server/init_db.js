import sqlite3 from 'sqlite3';
import config from './config.json' assert { type: "json" };

function init_db(db_path) {
    let db = new sqlite3.Database(db_path, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Users (
            chat_id INT PRIMARY KEY,
            locale INT,
            subscription TEXT,
            requests INT,
            managed_wallets TEXT
            )`);

        db.run(`CREATE TABLE IF NOT EXISTS Wallets (
            wallet TEXT PRIMARY KEY,
            added_by INTEGER,
            ca_info TEXT)`);

        db.run(`CREATE TABLE IF NOT EXISTS WalletsToTransactions (
            wallet TEXT PRIMARY KEY,
            last_tx_hash INTEGER,
            last_update INTEGER)`);

        db.run(`CREATE TABLE IF NOT EXISTS Transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wallet TEXT,
            tx_hash TEXT,
            type TEXT,
            created_at INTEGER,          
            value REAL,
            value_usd REAL,
            _from TEXT,
            _to TEXT,
            token_info TEXT,
            gas_usd REAL)`);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}
init_db(config.DB_PATH);