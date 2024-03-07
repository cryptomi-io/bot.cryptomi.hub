import axios from 'axios';
import Web3 from 'web3';
import retry from 'async-retry';

import config from '../config.json' assert { type: "json" };
import * as db from './database.js';
import { getEthHistoricalPrice, getShitcoinHistoricalPrice, getShitcoinPrice } from './crypto.js';

const web3 = new Web3(new Web3.providers.HttpProvider(config.HTTPS_PROVIDER))


export default class Analyzer {
    constructor(address, days_count) {
        this.address = address;
        this.days_count = days_count;
        this.max_day = new Date(new Date() - 1000 * 60 * 60 * 24 * 91).getTime() / 1000 // max timestamp (90 days ago)
        this.max_ts = new Date(new Date() - 1000 * 60 * 60 * 24 * this.days_count).getTime() / 1000 // timestamp for user
    }

    async init_data(txs, isTuple = false) {
        /*
        Initialize dictionary to set all in-out transactions and fees to zero.
        */
        let data = {}
        let caInfo
        if (isTuple) {
            caInfo = await db.getCaInfo(this.address)
        }

        for (let tx of txs) {
            console.log(tx)
            console.log(isTuple)
            let symbol = (isTuple) ? JSON.parse(tx.token_info).symbol : tx.tokenSymbol
            if (symbol in Object.keys(data)) continue

            data[symbol] = {}
            data[symbol]['ca'] = (isTuple) ? caInfo[symbol] : ""
            data[symbol]['decimal'] = (isTuple) ? +(JSON.parse(tx.token_info).decimal) : 0
            data[symbol]['honeypot'] = false
            data[symbol]['buy'] = 0
            data[symbol]['sell'] = 0
            data[symbol]['unrealized_$'] = 0
            data[symbol]['unrealized_%'] = 0
            data[symbol]['total_$'] = 0
            data[symbol]['total_%'] = 0
            data[symbol]['buy_taxes'] = 0
            data[symbol]['sell_taxes'] = 0
            data[symbol]['avg_time'] = 0
        }
        return data
    }

    count_avg_time(txs, symbol, isTuple = false) {
        /*
        Get transactions list and counts average trade time for this token.
        Calculation: (first buy ts - last sell ts)
        Returns time in seconds between last sell and first buy
        */
        const first_buy_ts = txs.filter(tx => tx._to === this.address && JSON.parse(tx.token_info).symbol === symbol) // this is all buys
        const last_sell_ts = txs.filter(tx => tx._from === this.address && JSON.parse(tx.token_info).symbol === symbol) // all sells

        // no sells for token or buys
        if (!last_sell_ts.length || !first_buy_ts.length) return 0
        return Number(last_sell_ts[0].created_at) - Number(first_buy_ts[first_buy_ts.length - 1].created_at)
    }

    count_total_avg_time(avgTimesArr) {
        /*
        Counts average time of all tokens trades in seconds
        Returns formatted str.
        */
        if (avgTimesArr.length === 0) return "0"
        const sum = avgTimesArr.reduce((pv, cv) => pv + cv, 0);
        seconds = Number(sum / (avgTimesArr.length))
        h = (seconds / 3600).toString()
        m = ((seconds % 3600) / 60).toString()
        s = ((seconds % 3600) % 60).toString()

        if (h === "0")
            return `${m} m. ${s} s.`
        return `${h} h. ${m} m. ${s} s.`
    }

    define_message(isHoneypot, realizedUsd, unrealizedUsd, buy) {
        /*
        Defines error message for Excel table
        */

        // token is honeypot
        if (isHoneypot)
            return "HONEYPOT"
        // token was bought and fully transferred to another wallet
        else if (realizedUsd + unrealizedUsd == 0 && buy != 0)
            return "TOKENS TRANSFERRED"
        return
    }

    async get_token_amount(ca) {
        /*
        Returns amount of token for given address.

        :ca: - contract address of token
        :wallet: - address to check 
        */
        const params = {
            "module": "account",
            "action": "tokenbalance",
            "contractaddress": ca,
            "address": this.address,
            "tag": "latest",
            "apikey": process.env.ETHERSCAN_API_KEY
        }
        return await new Promise((resolve, reject) => {
            axios("https://api.etherscan.io/api", {
                params: params
            })
                .then(res => {
                    (res.data.status === '1') ? resolve(+res.data.result) : reject(res.data.result)
                })
                .catch(err => reject(err))
        })
    }

    async get_transactions(action, sort = 'desc') {
        /*
        Returns transactions descending for address

        :action: - txlist (normal txs), tokentx (token transfers) etc.
        */
        const params = {
            "module": "account",
            "action": action,
            "address": this.address,
            "sort": sort,
            "apikey": process.env.ETHERSCAN_API_KEY
        }
        return await new Promise((resolve, reject) => {
            axios("https://api.etherscan.io/api", {
                params: params
            })
                .then(res => {
                    (res.data.status === '1') ? resolve(res.data.result) : reject(res.data.result)
                })
                .catch(err => reject(err))
        })
    }

    async get_transactions_by_date(action) {
        /*
        Returns all token buy/sell transactions for n days.

        Keyword arguments:
        :address: - Ethereum-chain address to get transactions
        :max_ts: - max date timestamp of transaction
        */
        let txs = await this.get_transactions(action)
        return txs.filter(tx => tx.timeStamp >= this.max_day)
    }

    async validate_tx(tx_hash) {
        /*
        Checks transaction method id, returns None if it's add/remove liquidity
        */

        const tx = await retry(async () => {
            return await web3.eth.getTransaction(tx_hash)
        }, {
            retries: 5, // Number of retries before giving up
            factor: 2, // Exponential factor
            minTimeout: 1000, // Minimum wait time before retrying
            maxTimeout: 10000, // Maximum wait time before retrying
            randomize: true, // Randomize the wait time
        }
        );
        if (config.METHODS_TO_FILTER.includes(tx.input.slice(0, 10))) return
        return tx['value'].toString()
    }

    async calculate_from_db() {
        /*
        Gets transactions from DB and calculates each token buys, sells, fees etc. in USD.
        */
        const txs = (await db.getWalletTxs(this.address)).filter(tx => tx.created_at > this.max_ts)
        if (txs.length === 0) return

        let data = await this.init_data(txs, true)
        for (let tx of txs) {
            let symbol = JSON.parse(tx.token_info).symbol
            if (tx.type === "sell") {
                data[symbol]['sell'] += tx.value_usd
                data[symbol]['sell_taxes'] += tx.gas_usd
            }
            else if (tx.type === "buy") {
                data[symbol]['buy'] += tx.value_usd
                data[symbol]['buy_taxes'] += tx.gas_usd
            }
            data[symbol]['avg_time'] = this.count_avg_time(txs, symbol, true)
        }
        return data
    }

    async calculate_in_usd(first_calculation = true) {
        /*
        Gets transactions and calculates each token buys, sells, fees etc. in USD.
        If this wallet was parsed before, then calling calculate_from_db().
        */
        const _10pow18 = BigInt(10 ** 18)

        if (!first_calculation) return this.calculate_from_db()

        let txs = await this.get_transactions_by_date("tokentx")
        if (txs.length === 0)
            return

        let data = await this.init_data(txs)
        let caInfo = {}
        let db_txs = [] // list of lists, every el - row of db

        console.log(txs.length)
        for (let tx of txs) {
            let value = Number(await this.validate_tx(tx.hash))

            if (isNaN(value)) continue

            // eth, weth, usdt, usdc
            if (config.CA_TO_FILTER.includes(tx.contractAddress)) continue

            // writing each token ca to save in db as {"symbol": "ca"}
            if (!Object.values(caInfo).includes(tx.contractAddress))
                caInfo[tx.tokenSymbol] = tx['contractAddress']

            const eth_price = await getEthHistoricalPrice(+tx.timeStamp)
            // calculating tx gas in usd
            const gas_usd = Number(BigInt(+tx.gasPrice * +tx.gasUsed) / _10pow18) * eth_price

            let token_price, value_usd, _type

            // SELL (OUT) (token -> eth)
            if (tx.from === this.address) {
                _type = "sell"
                let d = await getShitcoinHistoricalPrice(tx.contractAddress, tx.blockNumber)
                if (!d.success) { // token is honeypot
                    data[tx.tokenSymbol]['honeypot'] = true
                    token_price = 0
                }
                else {
                    token_price = +d.price
                }
                value_usd = Number(BigInt(tx.value) / BigInt(10 ** (+tx.tokenDecimal))) * token_price // возводим в степень token_decimal т к у некоторых токенов минимальный юнит не 18 и не 9, а decimal
                // value_usd = value_usd.toFixed(2)
            }
            // BUY (IN) (eth -> token)
            else if (tx['to'] === this.address) {
                _type = "buy"
                value_usd = Number(BigInt(value) / _10pow18) * eth_price // ток 18 степень т к value в эфире, а decimal возвращается именно для токена
                // value_usd = value_usd.toFixed(2)
            }

            // eg user wants analyze for 60 days, we are always getting txs for 90 days.
            // if ts > this.max_ts, when this tx is going for user analysis, else just adding to db
            // console.log(this.max_ts, +tx.timeStamp)
            if (+tx.timeStamp >= this.max_day) {
                data[tx.tokenSymbol]['ca'] = tx.contractAddress
                data[tx.tokenSymbol]['decimal'] = +tx.tokenDecimal
                if (_type == "sell") {
                    data[tx.tokenSymbol]['sell'] += value_usd
                    data[tx.tokenSymbol]['sell_taxes'] += gas_usd
                } else {
                    data[tx.tokenSymbol]['buy'] += value_usd
                    data[tx.tokenSymbol]['buy_taxes'] += gas_usd
                }
            }
            db_txs.push([this.address, tx.hash, _type, +tx.timeStamp, tx.value, value_usd, tx.from, tx.to, JSON.stringify({ "name": tx.tokenName, "symbol": tx.tokenSymbol, 'decimal': +tx.tokenDecimal, 'honeypot': data[tx.tokenSymbol]['honeypot'] }), gas_usd])
        }

        db.addTransactions(db_txs)
        db.updateLastTxInfo(this.address, txs[0].hash, +txs[0].timeStamp)
        db.updateCaInfo(JSON.stringify(caInfo), this.address)

        // dict comprehension: removing empty tokens (в инит дате токен добавился, но оказался ханипот/скам - убираем из data)
        // return {k: v for k, v in data.items() if data[k]['ca'] != ""}   
        return Object.fromEntries(Object.entries(data).filter(([key, value]) => value['ca'] !== ""))
    }

    async get_wallet_tokens() {
        /*
        Returns all current tokens and their supply on address right now.
        */
        const headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
        const data = {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "alchemy_getTokenBalances",
            "params": [
                this.address,
                "erc20"
            ]
        }
        return await new Promise((resolve, reject) => {
            axios.post(config.HTTPS_PROVIDER, data, {
                headers: headers
            })
                .then(res => (res.data?.error || res.status !== 200) ? reject([]) : resolve(res.data.result?.tokenBalances))
        })
    }

    async count_unrealized_pnl(prices, token_balances) {
        /*
        Returns dict filling unrealized PnL columns.
        */
        for (let token of Object.keys(prices)) {
            const decimal = +(prices[token]['decimal'])
            const buy = prices[token]['buy']
            const sell = prices[token]['sell']
            let token_price

            console.log(typeof (token_balances))
            let token_amount = token_balances.filter(el => el.contractAddress === prices[token]["ca"])
            if (!token_amount.length || parseInt(token_amount[0], 16) === 0) continue
            token_amount = parseInt(token_amount[0], 16) / 10 ** decimal

            d = await getShitcoinPrice(prices[token]['ca']) // getting current token price  
            if (!d['success']) {
                token_price = 0
                prices[token]['honeypot'] = true
            } else {
                token_price = d['price'] * token_amount
            }

            if ((buy === sell && sell === 0) || (token_price === 0)) {
                prices[token]['unrealized_%'] = 0
            } else if (buy === 0 && sell !== 0) {
                prices[token]['unrealized_%'] = -1
            } else {
                // prices[token]['unrealized_$'] += token_price.toFixed(2)
                // prices[token]['unrealized_%'] = (((token_price-buy) / buy) * 100).toFixed(2)
                prices[token]['unrealized_$'] += token_price
                prices[token]['unrealized_%'] = (((token_price - buy) / buy) * 100)
            }
        }
        return prices
    }

    async parse_info(first_calculation = false) {
        /*
        Get buys/sells of tokens in usd; get current balance of address; calculate ROI and sort by ROI
        */
        let prices = await this.calculate_in_usd(first_calculation)
        // no txs for given period
        if (!prices)
            return

        // getting all current tokens values on address
        let token_balances = this.get_wallet_tokens()

        // adds to dict fields with unrealized pnl $ and %
        prices = this.count_unrealized_pnl(prices, token_balances)

        let table_data = {
            "general_info": {
                "winrate": 0,
                "pnl_$": 0,
                "pnl_%": 0,
                "period": this.days_count,
                "avg_time": 0
            },
            "tokens_info": []
        }
        let wins = 0
        let losses = 0

        // counting ROI (substracting fees) and sorting
        for (let token of Object.keys(prices)) {
            // let buy = prices[token]['buy'].toFixed(2)
            // let sell = prices[token]['sell'].toFixed(2)
            let buy = prices[token]['buy']
            let sell = prices[token]['sell']
            let fees = prices[token]['sell_taxes'] + prices[token]['buy_taxes']
            let realized_ROI;
            let total_USD;
            let total_ROI;
            if (buy === 0) {
                continue
            } else {
                realized_ROI = ((sell - buy - fees) / buy) * 100
                total_USD = sell + prices[token]['unrealized_$'] - buy
                total_ROI = ((total_USD - fees) / buy) * 100 // dont consider buy because it is already in total_USD
            }
            if (total_ROI > 0) {
                wins += 1
            } else if (total_ROI < 0)
                losses += 1

            table_data['tokens_info'].push({
                "symbol": token,
                "ca": prices[token]['ca'],
                "buy": buy,
                'avg_time': this.count_avg_time(db.getWalletTxs(this.address), token, true),
                "total_$": total_USD,
                "total_%": total_ROI,
                "realized_$": sell,
                "realized_%": realized_ROI,
                "unrealized_$": prices[token]['unrealized_$'],
                "unrealized_%": prices[token]['unrealized_%'],
                'honeypot': prices[token]['honeypot'],
                'fees': fees,
                'message': this.define_message(prices[token]['honeypot'], sell, prices[token]['unrealized_$'], buy)
            })
        }

        // были транзы, но они все отфильтровались
        if (table_data['tokens_info'].length == 0)
            return

        // sum of all buys
        const buySum = table_data['tokens_info'].reduce((total, el) => total + el['buy'], 0)

        table_data['general_info']['winrate'] = ((wins / (wins + losses)) * 100).toFixed(2)
        table_data['general_info']['pnl_$'] = table_data['tokens_info'].reduce((total, el) => total + el['total_$'], 0).toFixed(2) // sum of array of total $ of each token
        table_data['general_info']['pnl_%'] = (table_data['general_info']['pnl_$'] / buySum) * 100

        const timesArray = table_data['tokens_info']
            .filter(({ avg_time }) => avg_time !== 0)
            .reduce((total, el) => total + el["avg_time"], 0)

        table_data['general_info']['avg_time'] = this.count_total_avg_time(timesArray)

        table_data['tokens_info'] = table_data['tokens_info'].sort((a, b) => {
            return a["total_%"] - b["total_%"]
        })

        let rating_data = {
            "general_info": table_data['general_info'].copy(),
            'tokens_info': []
        }
        // rating data excludes some situations
        for (let token of table_data['tokens_info']) {
            // token is honeypot
            if (token['honeypot']) {
                continue
                // token was bought and fully transferred to another wallet
            } else if (token['realized_$'] + token['unrealized_$'] === 0 && token['buy'] !== 0) {
                continue
                // tokens came from another wallet or pooled
            } else if (token['buy'] === 0) {
                continue
            }
            rating_data['tokens_info'].push(token)
        }
        return table_data, rating_data
    }
}