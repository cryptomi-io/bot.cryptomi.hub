import { Address, TonClient } from 'ton'

import { Api, HttpClient } from 'tonapi-sdk-js'
import Web3 from 'web3'

export const useTon = () => {
  const TON_API_KEY = import.meta.env.VITE_TON_API_KEY
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: TON_API_KEY
  })
  const httpClient = new HttpClient({
    baseUrl: 'https://tonapi.io/',
    baseApiParams: {
      headers: {
        Authorization: `Bearer AGXYVE4RVCICRRAAAAAP733HDU6CW5IRYGTFNXZBQWS3Z55O7DDG5WEPYZCZFWKAQCCOJGA`,
        'Content-type': 'application/json'
      }
    }
  })
  const tonv2Client = new Api(httpClient)

  const getAccount = async (wallet) => {
    let wallets = {
      TON: {
        currency: 'TON',
        available_balance: 0,
        image: '/images/tokens/ton.png',
        has_transactions: false,
        addresses: null,
        isJetton: false
      },
      USDT: {
        currency: 'USDT',
        available_balance: 0,
        image: '/images/tokens/usdt.png',
        has_transactions: false,
        addresses: null,
        isJetton: true
      },
      BTC: {
        currency: 'BTC',
        available_balance: 0,
        image: '/images/tokens/btc.png',
        has_transactions: false,
        address: null,
        isJetton: true
      },
      ETH: {
        currency: 'ETH',
        available_balance: 0,
        image: '/images/tokens/eth.png',
        has_transactions: false,
        address: null,
        isJetton: true
      }
    }

    const accountResponse = await tonv2Client.accounts.getAccount(wallet)

    let response = {
      address: accountResponse.address,
      balance: Web3.utils.fromWei(accountResponse.balance, 'nano'),
      is_wallet: accountResponse.is_wallet,
      last_activity: accountResponse.last_activity,
      memo_required: accountResponse.memo_required,
      name: accountResponse.name,
      status: accountResponse.status
    }
    wallets = {
      ...wallets,
      TON: {
        ...wallets.TON,
        address: accountResponse.address,
        available_balance: Web3.utils.fromWei(accountResponse.balance, 'nano')
      }
    }
    const jettonResponse = await tonv2Client.accounts.getAccountJettonsBalances(wallet)
    jettonResponse.balances.forEach((item) => {
      wallets[item.jetton.symbol] = {
        currency: item.jetton.symbol,
        available_balance: item.balance,
        image: item.jetton.image,
        address: item.wallet_address.address,
        isJetton: true,
        has_transactions: false
      }
    })

    response = {
      ...response,
      wallets: Object.values(wallets).sort((a, b) => {
        if (a.isJetton !== b.isJetton) {
          return a.isJetton ? 1 : -1
        }
        return Number(b.available_balance) - Number(a.available_balance)
      })
    }
    console.log(response)
    return response
  }
  const getTransactions = async (walletRaw, limit) => {
    let transactions = []
    const response = await tonv2Client.blockchain.getBlockchainAccountTransactions(walletRaw, {
      limit
    })
    response.transactions.forEach((item) => {
      if (item.success) {
        transactions.push({
          success: item.success,
          account: item.account,
          hash: item.hash,
          side: item.in_msg.value > 0 ? 'DEPOSIT' : 'WITHDRAW',
          from_address:
            item.in_msg.value > 0 ? item.in_msg?.source?.address : item.out_msgs[0]?.source.address,
          to_address:
            item.in_msg.value > 0
              ? item.in_msg?.destination?.address
              : item.out_msgs[0]?.destination?.address,
          amount:
            item.in_msg.value > 0
              ? Web3.utils.fromWei(item.in_msg.value, 'nano')
              : Web3.utils.fromWei(item.out_msgs[0].value, 'nano'),
          prev_trans_hash: item.prev_trans_hash,
          prev_trans_lt: item.prev_trans_lt,
          total_fees: item.total_fees,
          transaction_type: item.transaction_type,
          utime: item.utime
        })
      }
    })
    return transactions
  }

  const sendTransaction = async (walletTo, amount) => {
    const walletFrom = 'UQCV3YdlxazBZpIeb-7426nun1B-yyMrAtUNdl5zubWYfRQv'

    const jettonWalletAddress = Address.parse(walletFrom)
    const destinationAddress = Address.parse(walletTo)
  }

  const getJettons = async (walletRaw) => {
    return (await tonv2Client.accounts.getAccountJettonsBalances(walletRaw))?.balances
  }

  const getUserFriendlyAddress = (rawWallet) => {
    try {
      const walletAddress = Address.parse(rawWallet)
      return walletAddress.toString()
    } catch (e) {
      console.error(e.message)
    }
  }
  const getJettonTransfers = async (walletRaw) => {
    // const response = {
    //   events: [
    //     {
    //       event_id: 'e8b0e3fee4a26bd2317ac1f9952fcdc87dc08fdb617656b5202416323337372e',
    //       account: {
    //         address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //         name: 'Ton foundation',
    //         is_scam: true,
    //         icon: 'https://ton.org/logo.png',
    //         is_wallet: true
    //       },
    //       timestamp: 1234567890,
    //       actions: [
    //         {
    //           type: 'TonTransfer',
    //           status: 'ok',
    //           TonTransfer: {
    //             sender: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             recipient: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             amount: 123456789,
    //             comment: 'Hi! This is your salary. \nFrom accounting with love.',
    //             encrypted_comment: {
    //               encryption_type: 'simple',
    //               cipher_text: 'A6A0BD6608672B...CE3AF8DB'
    //             },
    //             refund: {
    //               type: 'DNS.ton',
    //               origin: '0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf'
    //             }
    //           },
    //           ContractDeploy: {
    //             address: '0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf',
    //             interfaces: ['nft_item', 'nft_royalty']
    //           },
    //           JettonTransfer: {
    //             sender: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             recipient: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             senders_wallet: '0:E93E7D444180608B8520C00DC664383A387356FB6E16FDDF99DBE5E1415A574B',
    //             recipients_wallet:
    //               '0:E93E7D444180608B8520C00DC664383A387356FB6E16FDDF99DBE5E1415A574B',
    //             amount: '1000000000',
    //             comment: 'Hi! This is your salary. \nFrom accounting with love.',
    //             encrypted_comment: {
    //               encryption_type: 'simple',
    //               cipher_text: 'A6A0BD6608672B...CE3AF8DB'
    //             },
    //             refund: {
    //               type: 'DNS.ton',
    //               origin: '0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf'
    //             },
    //             jetton: {
    //               address: '0:0BB5A9F69043EEBDDA5AD2E946EB953242BD8F603FE795D90698CEEC6BFC60A0',
    //               name: 'Wrapped TON',
    //               symbol: 'WTON',
    //               decimals: 9,
    //               image: 'https://cache.tonapi.io/images/jetton.jpg',
    //               verification: 'whitelist'
    //             }
    //           },
    //           JettonBurn: {
    //             sender: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             senders_wallet: '0:E93E7D444180608B8520C00DC664383A387356FB6E16FDDF99DBE5E1415A574B',
    //             amount: '1000000000',
    //             jetton: {
    //               address: '0:0BB5A9F69043EEBDDA5AD2E946EB953242BD8F603FE795D90698CEEC6BFC60A0',
    //               name: 'Wrapped TON',
    //               symbol: 'WTON',
    //               decimals: 9,
    //               image: 'https://cache.tonapi.io/images/jetton.jpg',
    //               verification: 'whitelist'
    //             }
    //           },
    //           JettonMint: {
    //             recipient: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             recipients_wallet:
    //               '0:E93E7D444180608B8520C00DC664383A387356FB6E16FDDF99DBE5E1415A574B',
    //             amount: '1000000000',
    //             jetton: {
    //               address: '0:0BB5A9F69043EEBDDA5AD2E946EB953242BD8F603FE795D90698CEEC6BFC60A0',
    //               name: 'Wrapped TON',
    //               symbol: 'WTON',
    //               decimals: 9,
    //               image: 'https://cache.tonapi.io/images/jetton.jpg',
    //               verification: 'whitelist'
    //             }
    //           },
    //           NftItemTransfer: {
    //             sender: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             recipient: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             nft: '',
    //             comment: 'Hi! This is your salary. \nFrom accounting with love.',
    //             encrypted_comment: {
    //               encryption_type: 'simple',
    //               cipher_text: 'A6A0BD6608672B...CE3AF8DB'
    //             },
    //             payload: '0234de3e21d21b3ee21f3',
    //             refund: {
    //               type: 'DNS.ton',
    //               origin: '0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf'
    //             }
    //           },
    //           Subscribe: {
    //             subscriber: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             subscription: '0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf',
    //             beneficiary: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             amount: 1000000000,
    //             initial: false
    //           },
    //           UnSubscribe: {
    //             subscriber: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             subscription: '0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf',
    //             beneficiary: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             }
    //           },
    //           AuctionBid: {
    //             auction_type: 'DNS.ton',
    //             amount: {
    //               value: '123000000000',
    //               token_name: 'TON'
    //             },
    //             nft: {
    //               address: '0:E93E7D444180608B8520C00DC664383A387356FB6E16FDDF99DBE5E1415A574B',
    //               index: 58,
    //               owner: {
    //                 address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                 name: 'Ton foundation',
    //                 is_scam: true,
    //                 icon: 'https://ton.org/logo.png',
    //                 is_wallet: true
    //               },
    //               collection: {
    //                 address: '0:E93E7D444180608B8520C00DC664383A387356FB6E16FDDF99DBE5E1415A574B',
    //                 name: 'TON Diamonds',
    //                 description: 'Best collection in TON network'
    //               },
    //               verified: true,
    //               metadata: {},
    //               sale: {
    //                 address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                 market: {
    //                   address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                   name: 'Ton foundation',
    //                   is_scam: true,
    //                   icon: 'https://ton.org/logo.png',
    //                   is_wallet: true
    //                 },
    //                 owner: {
    //                   address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                   name: 'Ton foundation',
    //                   is_scam: true,
    //                   icon: 'https://ton.org/logo.png',
    //                   is_wallet: true
    //                 },
    //                 price: {
    //                   value: '123000000000',
    //                   token_name: 'TON'
    //                 }
    //               },
    //               previews: [
    //                 {
    //                   resolution: '100x100',
    //                   url: 'https://site.com/pic1.jpg'
    //                 }
    //               ],
    //               dns: 'crypto.ton',
    //               approved_by: ['getgems']
    //             },
    //             bidder: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             auction: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             }
    //           },
    //           NftPurchase: {
    //             auction_type: 'DNS.ton',
    //             amount: {
    //               value: '123000000000',
    //               token_name: 'TON'
    //             },
    //             nft: {
    //               address: '0:E93E7D444180608B8520C00DC664383A387356FB6E16FDDF99DBE5E1415A574B',
    //               index: 58,
    //               owner: {
    //                 address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                 name: 'Ton foundation',
    //                 is_scam: true,
    //                 icon: 'https://ton.org/logo.png',
    //                 is_wallet: true
    //               },
    //               collection: {
    //                 address: '0:E93E7D444180608B8520C00DC664383A387356FB6E16FDDF99DBE5E1415A574B',
    //                 name: 'TON Diamonds',
    //                 description: 'Best collection in TON network'
    //               },
    //               verified: true,
    //               metadata: {},
    //               sale: {
    //                 address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                 market: {
    //                   address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                   name: 'Ton foundation',
    //                   is_scam: true,
    //                   icon: 'https://ton.org/logo.png',
    //                   is_wallet: true
    //                 },
    //                 owner: {
    //                   address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                   name: 'Ton foundation',
    //                   is_scam: true,
    //                   icon: 'https://ton.org/logo.png',
    //                   is_wallet: true
    //                 },
    //                 price: {
    //                   value: '123000000000',
    //                   token_name: 'TON'
    //                 }
    //               },
    //               previews: [
    //                 {
    //                   resolution: '100x100',
    //                   url: 'https://site.com/pic1.jpg'
    //                 }
    //               ],
    //               dns: 'crypto.ton',
    //               approved_by: ['getgems']
    //             },
    //             seller: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             buyer: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             }
    //           },
    //           DepositStake: {
    //             amount: 1660050553,
    //             staker: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             pool: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             implementation: 'whales'
    //           },
    //           WithdrawStake: {
    //             amount: 1660050553,
    //             staker: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             pool: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             implementation: 'whales'
    //           },
    //           WithdrawStakeRequest: {
    //             amount: 1660050553,
    //             staker: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             pool: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             implementation: 'whales'
    //           },
    //           ElectionsDepositStake: {
    //             amount: 1660050553,
    //             staker: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             }
    //           },
    //           ElectionsRecoverStake: {
    //             amount: 1660050553,
    //             staker: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             }
    //           },
    //           JettonSwap: {
    //             dex: 'stonfi',
    //             amount_in: '1660050553',
    //             amount_out: '1660050553',
    //             ton_in: 1000000000,
    //             ton_out: 2000000000,
    //             user_wallet: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             router: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             jetton_master_in: {
    //               address: '0:0BB5A9F69043EEBDDA5AD2E946EB953242BD8F603FE795D90698CEEC6BFC60A0',
    //               name: 'Wrapped TON',
    //               symbol: 'WTON',
    //               decimals: 9,
    //               image: 'https://cache.tonapi.io/images/jetton.jpg',
    //               verification: 'whitelist'
    //             },
    //             jetton_master_out: {
    //               address: '0:0BB5A9F69043EEBDDA5AD2E946EB953242BD8F603FE795D90698CEEC6BFC60A0',
    //               name: 'Wrapped TON',
    //               symbol: 'WTON',
    //               decimals: 9,
    //               image: 'https://cache.tonapi.io/images/jetton.jpg',
    //               verification: 'whitelist'
    //             }
    //           },
    //           SmartContractExec: {
    //             executor: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             contract: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             ton_attached: 123456789,
    //             operation: 'NftTransfer or 0x35d95a12',
    //             payload: 'string',
    //             refund: {
    //               type: 'DNS.ton',
    //               origin: '0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf'
    //             }
    //           },
    //           DomainRenew: {
    //             domain: 'vasya.ton',
    //             contract_address:
    //               '0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf',
    //             renewer: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             }
    //           },
    //           InscriptionTransfer: {
    //             sender: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             recipient: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             amount: '123456789',
    //             comment: 'Hi! This is your salary. \nFrom accounting with love.',
    //             type: 'ton20',
    //             ticker: 'nano',
    //             decimals: 9
    //           },
    //           InscriptionMint: {
    //             recipient: {
    //               address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //               name: 'Ton foundation',
    //               is_scam: true,
    //               icon: 'https://ton.org/logo.png',
    //               is_wallet: true
    //             },
    //             amount: '123456789',
    //             type: 'ton20',
    //             ticker: 'nano',
    //             decimals: 9
    //           },
    //           simple_preview: {
    //             name: 'Ton Transfer',
    //             description: 'Transferring 5 Ton',
    //             action_image: 'string',
    //             value: '5 Ton',
    //             value_image: 'string',
    //             accounts: [
    //               {
    //                 address: '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365',
    //                 name: 'Ton foundation',
    //                 is_scam: true,
    //                 icon: 'https://ton.org/logo.png',
    //                 is_wallet: true
    //               }
    //             ]
    //           }
    //         }
    //       ],
    //       is_scam: false,
    //       lt: 25713146000001,
    //       in_progress: false,
    //       extra: 3
    //     }
    //   ],
    //   next_from: 25713146000001
    // }
    const response = await tonv2Client.accounts.getAccountJettonsHistory(walletRaw, { limit: 1000 })
    return response?.events || []
  }

  return {
    getAccount,
    getTransactions,
    getUserFriendlyAddress,
    getJettons,
    getJettonTransfers,
    sendTransaction
  }
}
