import sqlite3 from 'sqlite3';
import config from '../config.json' assert { type: "json" };


const getTime = () => {
    const date = (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
    return `[${date}] `
}


let db = new sqlite3.Database(config.DB_PATH, (err) => {
    if (err) {
      console.error(`[${getTime()}] ` + err.message);
    }
    console.log(getTime() + "Successfully connected to the database.");
  });


const getAllWallets = async () => {
    return await new Promise((resolve, reject) => {
        db.all("SELECT wallet FROM Wallets", (err, data) => {
            if (err) reject(err)
            resolve(data)      
        })
    })
}


const getWalletTxs = async (wallet) => {
    return await new Promise((resolve, reject) => {
        db.all("SELECT * FROM Transactions WHERE wallet = ?", [wallet], (err, data) => {
            if (err) reject(err)
            resolve(data)      
        })
    })
}


const addTransaction = async (wallet, tx_hash, _type, created_at, value, value_usd, from, to, token_info, gas_usd) => {
    db.run("INSERT OR IGNORE INTO Transactions (wallet, tx_hash, type, created_at, value, value_usd, _from, _to, token_info, gas_usd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [wallet, tx_hash, _type, created_at, value, value_usd, from, to, token_info, gas_usd])
    console.log("ADDED NEW TRANSACTION TO DB! HASH: ", tx_hash)
}


const addTransactions = async (txs) => {
    const placeholders = txs.map((tx) => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
    const query = 'INSERT OR IGNORE INTO Transactions (wallet, tx_hash, type, created_at, value, value_usd, _from, _to, token_info, gas_usd) VALUES ' + placeholders;
    const flatData = [];

    txs.forEach((txs) => { txs.forEach((item) => { flatData.push(item) }) });
    
    db.serialize(() => {
        db.run(query, flatData, (err) => {})
    })
}


const updateLastTxInfo = async (wallet, tx_hash, timestamp) => {
    db.run("INSERT INTO WalletsToTransactions(wallet, last_tx_hash, last_update) VALUES (?, ?, ?) ON CONFLICT(wallet) DO UPDATE SET last_tx_hash = excluded.last_tx_hash, last_update = excluded.last_update;", [wallet, tx_hash, timestamp])
}


const getCaInfo = async (wallet) => {
    return await new Promise((resolve, reject) => {
        db.each("SELECT ca_info FROM wallets WHERE wallet = ?", [wallet], (err, data) => {
            if (err) reject(err)
            resolve(JSON.parse(data.ca_info))      
        })
    })
}


const updateCaInfo = async (caInfo, wallet) => {
    let _caInfo = await getCaInfo(wallet);
    const tokens = Object.keys(_caInfo);
    for (let token of Object.keys(caInfo)) {
        if (!tokens.includes(token)) _caInfo[token] = caInfo[token]
    }
    db.run("UPDATE Wallets SET ca_info = ? WHERE wallet = ? ", [JSON.stringify(_caInfo), wallet])
}

export { getTime, getAllWallets, getWalletTxs, addTransaction, addTransactions, updateLastTxInfo, getCaInfo, updateCaInfo };
