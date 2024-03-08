import { $etherscan } from '../services/etherscan'
import { Etherscan } from 'etherscan-ts'
import Web3 from 'web3'


export const useEtherscan = () => {
  const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY
  const $eth = new Etherscan(ETHERSCAN_API_KEY)

  /**
   * Async function to get the last price of Ethereum.
   *
   * @return {type} The last price of Ethereum, or null if an error occurs.
   */
  const getEthLastPrice = async () => {
    try {
      const response = await $eth.getEtherLastPrice()
      return response.result
    } catch (error) {
      console.log(error)
    }
    return null
  }

  /**
   * Retrieves transactions for a given wallet within a specified number of days.
   *
   * @param {Object} wallet - the wallet for which transactions are being retrieved
   * @param {number} days - the number of days for which transactions are being retrieved
   * @return {Array} an array of transactions within the specified time frame
   */
  const getTransactions = async (wallet, days) => {
    let transactions = []
    const latestBlockNumber = await getLatestBlockNumber()
    const { startblock, endblock } = await getBlocksFilterByDate(latestBlockNumber, days)
    try {
      const response = await $eth.getERC20TokenTransferEventList(
        wallet,
        undefined,
        undefined,
        undefined,
        startblock,
        endblock,
        'asc'
      )
      transactions = response?.result
    } catch (error) {
      console.error(error)
    }

    return transactions
  }

  /**
   * Function to get the latest block number from the specified URL using the Etherscan API key.
   *
   * @return {number} The latest block number in decimal format.
   */
  const getLatestBlockNumber = async () => {
    const params = new URLSearchParams({
      module: 'proxy',
      action: 'eth_blockNumber'
    })

    try {
      const response = await $etherscan.get(`?${params}`)
      return parseInt(response?.data?.result, 16)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Calculate the quantity by converting the value from wei to ether.
   *
   * @param {type} value - the value to convert
   * @return {type} the quantity in ether
   */
  const getQuantityByValue = (value) => {
    return Number(Web3.utils.fromWei(value, 'ether'))
  }
  const weiToNumber = (value) => {
    return Number(Web3.utils.fromWei(value, 'ether'))
  }

  /**
   * Calculate the start and end blocks based on the latest block number and the number of days ago.
   *
   * @param {number} latestBlockNumber - the latest block number
   * @param {number} daysAgo - the number of days ago to calculate blocks for
   * @return {object} an object containing the start and end block numbers
   */
  const getBlocksFilterByDate = async (latestBlockNumber, daysAgo) => {
    /* 
    В среднем, в Ethereum новый блок генерируется каждые 15 секунд. Таким образом, за один день генерируется примерно 5760 блоков 
    (24 часа * 60 минут * 4 блока в минуту). 
    За 30 дней генерируется примерно 172800 блоков.
    За 60 дней генерируется примерно 345600 блоков.
    За 90 дней генерируется примерно 518400 блоков.
    За 120 дней генерируется примерно 691200 блоков.
    */
    const blocksPerDay = (24 * 60 * 60) / 15
    const blocksByDaysAgo = blocksPerDay * daysAgo
    return {
      startblock: latestBlockNumber - blocksByDaysAgo,
      endblock: latestBlockNumber
    }
  }

  const _temp_transactions = () => {
    return [
      {
        blockNumber: '19074780',
        timeStamp: '1706078531',
        hash: '0x0a49edaaaa72d9643bbd58b91544c0bc2fe357a89164bc8180c5e264f7474405',
        nonce: '753',
        blockHash: '0x4b4bf9caacd708c37dc26c5b3e52d7242ee2ad05d63c3ed643202d83a61fbbba',
        from: '0x13221e72db96c555dbac87f52a07018d0ad09dd8',
        contractAddress: '0xaa742641216545fe7daaf31b29eba818b54bdeb7',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '302025068400000000',
        tokenName: 'RATSSS',
        tokenSymbol: 'RATSSS',
        tokenDecimal: '8',
        transactionIndex: '104',
        gas: '304780',
        gasPrice: '9250617735',
        gasUsed: '203187',
        cumulativeGasUsed: '10549422',
        input: 'deprecated',
        confirmations: '293343'
      },
      {
        blockNumber: '19060537',
        timeStamp: '1705905431',
        hash: '0xcd29e6a4868b3fc0880cc8bb93ce4a78b8d4a9fc22e6513236c25301a3937150',
        nonce: '664',
        blockHash: '0xc669ba0b165d79cf9e3b61d5f9ad19d7a1e76c117a36776d7ae5c935ed8ac74a',
        from: '0xd6e8f606600dbecb549d78ee62a5f3080ae51a9e',
        contractAddress: '0x7b8ed22c3692581090caaf36d6549969b9835419',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '360225012400000000',
        tokenName: 'TADE',
        tokenSymbol: 'TADE',
        tokenDecimal: '8',
        transactionIndex: '62',
        gas: '297738',
        gasPrice: '10620828425',
        gasUsed: '198492',
        cumulativeGasUsed: '2321630',
        input: 'deprecated',
        confirmations: '307586'
      },
      {
        blockNumber: '18920078',
        timeStamp: '1704203135',
        hash: '0x8806e4009e7ab0fe02b859cb339fda71e4bed1a8440d445970378e97aa85ecbb',
        nonce: '567',
        blockHash: '0x4e15d761f345ff3f162996788d45cfd88b5ddf508c7c09fcd284bc77ae133e87',
        from: '0x5637d1b7ece47006ba2696ada77438ca0177ef85',
        contractAddress: '0x5d7d6487dc9339154d024d87591090caf9e14807',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '247631138800000000',
        tokenName: 'UASHJSD',
        tokenSymbol: 'UASHJSD',
        tokenDecimal: '8',
        transactionIndex: '153',
        gas: '297738',
        gasPrice: '20458158602',
        gasUsed: '198492',
        cumulativeGasUsed: '9282281',
        input: 'deprecated',
        confirmations: '448045'
      },
      {
        blockNumber: '18897517',
        timeStamp: '1703929343',
        hash: '0xef79989dc35d0a45a9d93143793f29aa0c7f80ee8cfee48239d48bedb18e9f32',
        nonce: '146',
        blockHash: '0xc93096b00f29b4a4232d1850dfb35d0a8692a706a7b4666aa3272e912abea389',
        from: '0x14c42cf19d07cabf0dc0a52cd87a6dd154ec2e1e',
        contractAddress: '0xa14d972c20a30ef4de3c9e0dbc55cb1353ddcf70',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '174629377800000000',
        tokenName: 'SOLDOGE',
        tokenSymbol: 'SOLDOGE',
        tokenDecimal: '8',
        transactionIndex: '68',
        gas: '297738',
        gasPrice: '12507506362',
        gasUsed: '198492',
        cumulativeGasUsed: '8726351',
        input: 'deprecated',
        confirmations: '470606'
      },
      {
        blockNumber: '18852545',
        timeStamp: '1703383463',
        hash: '0x7a25b2d5416084b76fb74a95caef8d770f97a99d95b0858c4024455bbba8dc6b',
        nonce: '195',
        blockHash: '0xebda95233fc76e23eb587bd3d46cd3f908b411925abdb5a7d3229b86480ec699',
        from: '0xb23a95fd41b2ce839007e5700900065a792c6aa0',
        contractAddress: '0x91322d9cb8e403e2d5ebc581ff8f70eb1821e4f9',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '209241606700000000',
        tokenName: 'RICTE',
        tokenSymbol: 'RICTE',
        tokenDecimal: '8',
        transactionIndex: '72',
        gas: '297738',
        gasPrice: '17053730124',
        gasUsed: '198492',
        cumulativeGasUsed: '7657122',
        input: 'deprecated',
        confirmations: '515578'
      },
      {
        blockNumber: '18838857',
        timeStamp: '1703217479',
        hash: '0x9b7cb5796378f5a69736d0bf7270c98105903794e867162e75bfbc654ff7b248',
        nonce: '65',
        blockHash: '0x14a0c254c97c41e2c5e518b18307d9efe65564ca1edbbbbf46bf1cfb6fe58ad0',
        from: '0x62321761fbb7b695650f3a1bda0f5a36250334d6',
        contractAddress: '0x785c62392011999700eaa3aee2d7be87ec537add',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '271279769700000000',
        tokenName: 'PUSOT',
        tokenSymbol: 'PUSOT',
        tokenDecimal: '8',
        transactionIndex: '96',
        gas: '297738',
        gasPrice: '28450458597',
        gasUsed: '198492',
        cumulativeGasUsed: '6095462',
        input: 'deprecated',
        confirmations: '529266'
      },
      {
        blockNumber: '18833610',
        timeStamp: '1703154083',
        hash: '0xd626745d0e28d4bf63889612d97eb3dd2a28977eface64431c0868521cf84a09',
        nonce: '97',
        blockHash: '0x00d9fe7b1c88fc55c439205c96c0f9bfb081e535d5e65edf03481b545362b2dc',
        from: '0x87a7b21c718a3caa02124630301012ab54a0c3b3',
        contractAddress: '0xa8a8e5fe66789f797fa655072fda7e2b3eaec2aa',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '980978893300000000',
        tokenName: 'CRAZY AI',
        tokenSymbol: 'CRAZY AI',
        tokenDecimal: '8',
        transactionIndex: '148',
        gas: '285934',
        gasPrice: '34056944682',
        gasUsed: '190623',
        cumulativeGasUsed: '9197327',
        input: 'deprecated',
        confirmations: '534513'
      },
      {
        blockNumber: '18831351',
        timeStamp: '1703126663',
        hash: '0x3e612765c94aa7a5b7c5a96007884a5696382515186184bc900589da3abb62a4',
        nonce: '44',
        blockHash: '0x6690185d048178fff12d45fc7822f852f900d15ebd6f3470bb472837db722b99',
        from: '0x81652d6e3d0ea22bb69345729bda77fc7d95d1b3',
        contractAddress: '0xd9b357cf005a022102babd05dda7216a70da2f7f',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '20053006700000000',
        tokenName: 'ORDI DOGE',
        tokenSymbol: 'ORDIDOGE',
        tokenDecimal: '8',
        transactionIndex: '48',
        gas: '285982',
        gasPrice: '39044111062',
        gasUsed: '190655',
        cumulativeGasUsed: '5550837',
        input: 'deprecated',
        confirmations: '536772'
      },
      {
        blockNumber: '18757973',
        timeStamp: '1702237451',
        hash: '0x352a1a7641809857daee210a3fbb463da03bae51a1abccf593660bb89866cf1b',
        nonce: '206',
        blockHash: '0x2332372ff5fa46a3fe11e92356e64cb6805da8bd970d33f97d9d54420a8d22f0',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x6c00add52419e014bfe4a7caed719818bf7ec2cc',
        to: '0xb897d60fec059691cf286ae7cb82d7a92b63b7fb',
        value: '208205966000000000',
        tokenName: 'Freya',
        tokenSymbol: 'FREYA',
        tokenDecimal: '9',
        transactionIndex: '23',
        gas: '316379',
        gasPrice: '44568326250',
        gasUsed: '158744',
        cumulativeGasUsed: '24157043',
        input: 'deprecated',
        confirmations: '610150'
      },
      {
        blockNumber: '18757722',
        timeStamp: '1702234439',
        hash: '0x2b81b845f01c47e0265b6f255a78ff972478233d9b54ed3edac11aa6bb0f8fe4',
        nonce: '204',
        blockHash: '0x744852a42096f3ec88e6296cf1284b48aeb57277c7b09edca25b9ee93467c0e5',
        from: '0xb897d60fec059691cf286ae7cb82d7a92b63b7fb',
        contractAddress: '0x6c00add52419e014bfe4a7caed719818bf7ec2cc',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '208205966939811265',
        tokenName: 'Freya',
        tokenSymbol: 'FREYA',
        tokenDecimal: '9',
        transactionIndex: '15',
        gas: '290103',
        gasPrice: '36810728104',
        gasUsed: '155815',
        cumulativeGasUsed: '3051071',
        input: 'deprecated',
        confirmations: '610401'
      },
      {
        blockNumber: '18715400',
        timeStamp: '1701721895',
        hash: '0xa4fa4881f3d8c3434a7e4fc4ece0a0ac95d8eee87eac86e20ee27ee7079f044a',
        nonce: '202',
        blockHash: '0xe30a16c65c1d9abeea785867c4c7f906a858939ac3aa92433304dd89d038dea6',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x621942983426f730b3314cbfaffafc10fefa16d9',
        value: '73424153868863345422925',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '106',
        gas: '233230',
        gasPrice: '62771377934',
        gasUsed: '157061',
        cumulativeGasUsed: '7432623',
        input: 'deprecated',
        confirmations: '652723'
      },
      {
        blockNumber: '18715400',
        timeStamp: '1701721895',
        hash: '0xa4fa4881f3d8c3434a7e4fc4ece0a0ac95d8eee87eac86e20ee27ee7079f044a',
        nonce: '202',
        blockHash: '0xe30a16c65c1d9abeea785867c4c7f906a858939ac3aa92433304dd89d038dea6',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        value: '741658119887508539625',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '106',
        gas: '233230',
        gasPrice: '62771377934',
        gasUsed: '157061',
        cumulativeGasUsed: '7432623',
        input: 'deprecated',
        confirmations: '652723'
      },
      {
        blockNumber: '18713493',
        timeStamp: '1701698867',
        hash: '0x11eca545b17894e3c35965226b8fdc4119be20f7fcdea31595571c8f738d4407',
        nonce: '200',
        blockHash: '0xab37114505674a0351bb4e5d8f761c758123c8f578c3c02a4966738f1a3fdc5e',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x621942983426f730b3314cbfaffafc10fefa16d9',
        value: '73260000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '182',
        gas: '233202',
        gasPrice: '60726713546',
        gasUsed: '166637',
        cumulativeGasUsed: '15237374',
        input: 'deprecated',
        confirmations: '654630'
      },
      {
        blockNumber: '18713493',
        timeStamp: '1701698867',
        hash: '0x11eca545b17894e3c35965226b8fdc4119be20f7fcdea31595571c8f738d4407',
        nonce: '200',
        blockHash: '0xab37114505674a0351bb4e5d8f761c758123c8f578c3c02a4966738f1a3fdc5e',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        value: '740000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '182',
        gas: '233202',
        gasPrice: '60726713546',
        gasUsed: '166637',
        cumulativeGasUsed: '15237374',
        input: 'deprecated',
        confirmations: '654630'
      },
      {
        blockNumber: '18705737',
        timeStamp: '1701604967',
        hash: '0x177fd8dd0f7728b3200c54b501f4b24121d8ec5e3dd1915d0aac70091fd31480',
        nonce: '347',
        blockHash: '0x0706779833b3cf851f8e71471aac16be5606540c141863b3103adfdb10e0cc2a',
        from: '0x2428dd4dd3ca14a1a196ac68bf52ed3cea43661d',
        contractAddress: '0x688a75a4beda5812f82c71bba0b6d45ae17c4381',
        to: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        value: '298176984600000000',
        tokenName: 'PAMPE',
        tokenSymbol: 'PAMPE',
        tokenDecimal: '8',
        transactionIndex: '228',
        gas: '247032',
        gasPrice: '24856533723',
        gasUsed: '164688',
        cumulativeGasUsed: '22446312',
        input: 'deprecated',
        confirmations: '662386'
      },
      {
        blockNumber: '18700946',
        timeStamp: '1701546959',
        hash: '0xda888d59798af4f3a5ea5b204d7f0ccacc9d80772d575ff1ce48beb6d40d8241',
        nonce: '198',
        blockHash: '0x2b8111a623c145d06e75093047d05ac215f096a2d0bf8169d0712dada07bc8b2',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x621942983426f730b3314cbfaffafc10fefa16d9',
        value: '69300000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '151',
        gas: '233202',
        gasPrice: '42911945687',
        gasUsed: '166637',
        cumulativeGasUsed: '11993909',
        input: 'deprecated',
        confirmations: '667177'
      },
      {
        blockNumber: '18700946',
        timeStamp: '1701546959',
        hash: '0xda888d59798af4f3a5ea5b204d7f0ccacc9d80772d575ff1ce48beb6d40d8241',
        nonce: '198',
        blockHash: '0x2b8111a623c145d06e75093047d05ac215f096a2d0bf8169d0712dada07bc8b2',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        value: '700000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '151',
        gas: '233202',
        gasPrice: '42911945687',
        gasUsed: '166637',
        cumulativeGasUsed: '11993909',
        input: 'deprecated',
        confirmations: '667177'
      },
      {
        blockNumber: '18699468',
        timeStamp: '1701529151',
        hash: '0x498487adfa6979567381444262f77acd6ebfb02726fe3f8f039612fc6e586e8d',
        nonce: '197',
        blockHash: '0x679639e95080b5686afb7b7113a6a08ff983e17d0f59ec90360b558b3dbf4231',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x621942983426f730b3314cbfaffafc10fefa16d9',
        value: '59400000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '151',
        gas: '233202',
        gasPrice: '37594952473',
        gasUsed: '166637',
        cumulativeGasUsed: '12781886',
        input: 'deprecated',
        confirmations: '668655'
      },
      {
        blockNumber: '18699468',
        timeStamp: '1701529151',
        hash: '0x498487adfa6979567381444262f77acd6ebfb02726fe3f8f039612fc6e586e8d',
        nonce: '197',
        blockHash: '0x679639e95080b5686afb7b7113a6a08ff983e17d0f59ec90360b558b3dbf4231',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        value: '600000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '151',
        gas: '233202',
        gasPrice: '37594952473',
        gasUsed: '166637',
        cumulativeGasUsed: '12781886',
        input: 'deprecated',
        confirmations: '668655'
      },
      {
        blockNumber: '18693341',
        timeStamp: '1701455195',
        hash: '0xa5468a394597306ac210521321667b6f6a3be0270ce60c70c14ef86cd34166fd',
        nonce: '195',
        blockHash: '0xe1d0ebb8dade81c8e3533cf3954c17b1fe48613e2aa2f2ad1bbf8fa7dc7bb443',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x621942983426f730b3314cbfaffafc10fefa16d9',
        value: '49500000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '64',
        gas: '233202',
        gasPrice: '59219948520',
        gasUsed: '166637',
        cumulativeGasUsed: '7334774',
        input: 'deprecated',
        confirmations: '674782'
      },
      {
        blockNumber: '18693341',
        timeStamp: '1701455195',
        hash: '0xa5468a394597306ac210521321667b6f6a3be0270ce60c70c14ef86cd34166fd',
        nonce: '195',
        blockHash: '0xe1d0ebb8dade81c8e3533cf3954c17b1fe48613e2aa2f2ad1bbf8fa7dc7bb443',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        value: '500000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '64',
        gas: '233202',
        gasPrice: '59219948520',
        gasUsed: '166637',
        cumulativeGasUsed: '7334774',
        input: 'deprecated',
        confirmations: '674782'
      },
      {
        blockNumber: '18691553',
        timeStamp: '1701433571',
        hash: '0x331d60db39e3e1fd875e6503e81809c58489d80119937662e757f9258de119b7',
        nonce: '194',
        blockHash: '0x05efbfb51c1089fe5f8cfebcf029e423c3ca85b0008fe9e087825ad5b73bdf71',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x621942983426f730b3314cbfaffafc10fefa16d9',
        value: '56232000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '55',
        gas: '233202',
        gasPrice: '39607472032',
        gasUsed: '166637',
        cumulativeGasUsed: '9969753',
        input: 'deprecated',
        confirmations: '676570'
      },
      {
        blockNumber: '18691553',
        timeStamp: '1701433571',
        hash: '0x331d60db39e3e1fd875e6503e81809c58489d80119937662e757f9258de119b7',
        nonce: '194',
        blockHash: '0x05efbfb51c1089fe5f8cfebcf029e423c3ca85b0008fe9e087825ad5b73bdf71',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        value: '568000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '55',
        gas: '233202',
        gasPrice: '39607472032',
        gasUsed: '166637',
        cumulativeGasUsed: '9969753',
        input: 'deprecated',
        confirmations: '676570'
      },
      {
        blockNumber: '18688016',
        timeStamp: '1701390803',
        hash: '0x471326475f2a75f1fd915a94946d4f91cdba4695436db20574b82c28d28fdabc',
        nonce: '192',
        blockHash: '0xa286f36e5a12a0df24426e0d7877b2d83c468fde82b0957990871875eaf7395c',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x621942983426f730b3314cbfaffafc10fefa16d9',
        value: '99000000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '75',
        gas: '233202',
        gasPrice: '39137083906',
        gasUsed: '166637',
        cumulativeGasUsed: '9861288',
        input: 'deprecated',
        confirmations: '680107'
      },
      {
        blockNumber: '18688016',
        timeStamp: '1701390803',
        hash: '0x471326475f2a75f1fd915a94946d4f91cdba4695436db20574b82c28d28fdabc',
        nonce: '192',
        blockHash: '0xa286f36e5a12a0df24426e0d7877b2d83c468fde82b0957990871875eaf7395c',
        from: '0x13351e338ca96b6f7bc944a9f4ff809da0c87c8b',
        contractAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        to: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        value: '1000000000000000000000',
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenDecimal: '18',
        transactionIndex: '75',
        gas: '233202',
        gasPrice: '39137083906',
        gasUsed: '166637',
        cumulativeGasUsed: '9861288',
        input: 'deprecated',
        confirmations: '680107'
      }
    ]
  }

  const _temp_actual_prices = () => {
    return [
      {
        tokenName: 'RATSSS',
        tokenSymbol: 'RATSSS',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '1033333333',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000002348878033532,
        usdPriceFormatted: '0.000002348878033532',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0xaa742641216545fe7daaf31b29eba818b54bdeb7',
        priceLastChangedAtBlock: '19109613',
        verifiedContract: false
      },
      {
        tokenName: 'TADE',
        tokenSymbol: 'TADE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '1108970100',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000002587110696663,
        usdPriceFormatted: '0.000002587110696663',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x7b8ed22c3692581090caaf36d6549969b9835419',
        priceLastChangedAtBlock: '19067877',
        verifiedContract: false
      },
      {
        tokenName: 'UASHJSD',
        tokenSymbol: 'UASHJSD',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '949846154',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000002130456835563,
        usdPriceFormatted: '0.000002130456835563',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x5d7d6487dc9339154d024d87591090caf9e14807',
        priceLastChangedAtBlock: '18938721',
        verifiedContract: false
      },
      {
        tokenName: 'SOLDOGE',
        tokenSymbol: 'SOLDOGE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '2174883721',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000005168962233324,
        usdPriceFormatted: '0.000005168962233324',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0xa14d972c20a30ef4de3c9e0dbc55cb1353ddcf70',
        priceLastChangedAtBlock: '18917093',
        verifiedContract: false
      },
      {
        tokenName: 'RICTE',
        tokenSymbol: 'RICTE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '4788275862',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.00001091379386597,
        usdPriceFormatted: '0.000010913793865970',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x91322d9cb8e403e2d5ebc581ff8f70eb1821e4f9',
        priceLastChangedAtBlock: '18862605',
        verifiedContract: false
      },
      {
        tokenName: 'PUSOT',
        tokenSymbol: 'PUSOT',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '1773529412',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000004060714208955,
        usdPriceFormatted: '0.000004060714208955',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x785c62392011999700eaa3aee2d7be87ec537add',
        priceLastChangedAtBlock: '18846773',
        verifiedContract: false
      },
      {
        tokenName: 'CRAZY AI',
        tokenSymbol: 'CRAZY AI',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '21326086957',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000049220999193179,
        usdPriceFormatted: '0.000049220999193179',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0xa8a8e5fe66789f797fa655072fda7e2b3eaec2aa',
        priceLastChangedAtBlock: '18841474',
        verifiedContract: false
      },
      {
        tokenName: 'ORDI DOGE',
        tokenSymbol: 'ORDIDOGE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '12152747253',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.0000267005711161,
        usdPriceFormatted: '0.000026700571116100',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0xd9b357cf005a022102babd05dda7216a70da2f7f',
        priceLastChangedAtBlock: '18832422',
        verifiedContract: false
      },
      {
        tokenName: 'Freya',
        tokenSymbol: 'FREYA',
        tokenLogo: null,
        tokenDecimals: '9',
        nativePrice: {
          value: '5328468',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 1.8155739431e-8,
        usdPriceFormatted: '0.000000018155739431',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x6c00add52419e014bfe4a7caed719818bf7ec2cc',
        priceLastChangedAtBlock: '19347957',
        verifiedContract: false
      },
      {
        tokenName: 'PAMPE',
        tokenSymbol: 'PAMPE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '14703384747',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000034615478945616,
        usdPriceFormatted: '0.000034615478945616',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x688a75a4beda5812f82c71bba0b6d45ae17c4381',
        priceLastChangedAtBlock: '18745739',
        verifiedContract: false
      }
    ]
  }

  const _temp_historycal_price = () => {
    return [
      {
        tokenName: 'RATSSS',
        tokenSymbol: 'RATSSS',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '503999133',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000001122679364217,
        usdPriceFormatted: '0.000001122679364217',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0xaa742641216545fe7daaf31b29eba818b54bdeb7',
        toBlock: '19074780',
        priceLastChangedAtBlock: '19074759',
        verifiedContract: false
      },
      {
        tokenName: 'TADE',
        tokenSymbol: 'TADE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '829795386',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000002015453607846,
        usdPriceFormatted: '0.000002015453607846',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x7b8ed22c3692581090caaf36d6549969b9835419',
        toBlock: '19060537',
        priceLastChangedAtBlock: '19060267',
        verifiedContract: false
      },
      {
        tokenName: 'UASHJSD',
        tokenSymbol: 'UASHJSD',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '839848075',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000002013014105887,
        usdPriceFormatted: '0.000002013014105887',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x5d7d6487dc9339154d024d87591090caf9e14807',
        toBlock: '18920078',
        priceLastChangedAtBlock: '18920076',
        verifiedContract: false
      },
      {
        tokenName: 'SOLDOGE',
        tokenSymbol: 'SOLDOGE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '1622793963',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000003695021823519,
        usdPriceFormatted: '0.000003695021823519',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0xa14d972c20a30ef4de3c9e0dbc55cb1353ddcf70',
        toBlock: '18897517',
        priceLastChangedAtBlock: '18897492',
        verifiedContract: false
      },
      {
        tokenName: 'RICTE',
        tokenSymbol: 'RICTE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '2119354558',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000004890907412935,
        usdPriceFormatted: '0.000004890907412935',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x91322d9cb8e403e2d5ebc581ff8f70eb1821e4f9',
        toBlock: '18852545',
        priceLastChangedAtBlock: '18852309',
        verifiedContract: false
      },
      {
        tokenName: 'PUSOT',
        tokenSymbol: 'PUSOT',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '1347974993',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000003024837686609,
        usdPriceFormatted: '0.000003024837686609',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x785c62392011999700eaa3aee2d7be87ec537add',
        toBlock: '18838857',
        priceLastChangedAtBlock: '18838845',
        verifiedContract: false
      },
      {
        tokenName: 'CRAZY AI',
        tokenSymbol: 'CRAZY AI',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '17627158546',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000039018550810242,
        usdPriceFormatted: '0.000039018550810242',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0xa8a8e5fe66789f797fa655072fda7e2b3eaec2aa',
        toBlock: '18833610',
        priceLastChangedAtBlock: '18833245',
        verifiedContract: false
      },
      {
        tokenName: 'ORDI DOGE',
        tokenSymbol: 'ORDIDOGE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '12188835455',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000026789279574522,
        usdPriceFormatted: '0.000026789279574522',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0xd9b357cf005a022102babd05dda7216a70da2f7f',
        toBlock: '18831351',
        priceLastChangedAtBlock: '18831287',
        verifiedContract: false
      },
      {
        tokenName: 'Freya',
        tokenSymbol: 'FREYA',
        tokenLogo: null,
        tokenDecimals: '9',
        nativePrice: {
          value: '267844325',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 6.30933587887e-7,
        usdPriceFormatted: '0.000000630933587887',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x6c00add52419e014bfe4a7caed719818bf7ec2cc',
        toBlock: '18757973',
        priceLastChangedAtBlock: '18757973',
        verifiedContract: false
      },
      {
        tokenName: 'Freya',
        tokenSymbol: 'FREYA',
        tokenLogo: null,
        tokenDecimals: '9',
        nativePrice: {
          value: '476183098',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000001120620613256,
        usdPriceFormatted: '0.000001120620613256',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x6c00add52419e014bfe4a7caed719818bf7ec2cc',
        toBlock: '18757722',
        priceLastChangedAtBlock: '18757722',
        verifiedContract: false
      },
      {
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenLogo: null,
        tokenDecimals: '18',
        nativePrice: {
          value: '1024724215363',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.002286498146759077,
        usdPriceFormatted: '0.002286498146759077',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        toBlock: '18715400',
        priceLastChangedAtBlock: '18715400',
        verifiedContract: true
      },
      {
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenLogo: null,
        tokenDecimals: '18',
        nativePrice: {
          value: '1133393032493',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.002531806284180068,
        usdPriceFormatted: '0.002531806284180068',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        toBlock: '18713493',
        priceLastChangedAtBlock: '18713493',
        verifiedContract: true
      },
      {
        tokenName: 'PAMPE',
        tokenSymbol: 'PAMPE',
        tokenLogo: null,
        tokenDecimals: '8',
        nativePrice: {
          value: '3312519430',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.000007155014738331,
        usdPriceFormatted: '0.000007155014738331',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x688a75a4beda5812f82c71bba0b6d45ae17c4381',
        toBlock: '18705737',
        priceLastChangedAtBlock: '18705710',
        verifiedContract: false
      },
      {
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenLogo: null,
        tokenDecimals: '18',
        nativePrice: {
          value: '1180195979578',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.002546457354939228,
        usdPriceFormatted: '0.002546457354939228',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        toBlock: '18700946',
        priceLastChangedAtBlock: '18700946',
        verifiedContract: true
      },
      {
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenLogo: null,
        tokenDecimals: '18',
        nativePrice: {
          value: '1323992470877',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.00278206461729764,
        usdPriceFormatted: '0.002782064617297640',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        toBlock: '18699468',
        priceLastChangedAtBlock: '18699468',
        verifiedContract: true
      },
      {
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenLogo: null,
        tokenDecimals: '18',
        nativePrice: {
          value: '1623041898989',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.003394927317459092,
        usdPriceFormatted: '0.003394927317459092',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        toBlock: '18693341',
        priceLastChangedAtBlock: '18693341',
        verifiedContract: true
      },
      {
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenLogo: null,
        tokenDecimals: '18',
        nativePrice: {
          value: '1314564393820',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.002750703816425019,
        usdPriceFormatted: '0.002750703816425019',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        toBlock: '18691553',
        priceLastChangedAtBlock: '18691553',
        verifiedContract: true
      },
      {
        tokenName: 'X-mass',
        tokenSymbol: 'X-mass',
        tokenLogo: null,
        tokenDecimals: '18',
        nativePrice: {
          value: '601737362716',
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        },
        usdPrice: 0.001233832503080993,
        usdPriceFormatted: '0.001233832503080993',
        exchangeName: 'Uniswap v2',
        exchangeAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        tokenAddress: '0x19f8ed44aa2f5580d44ca6ed2a0e9bb33a08922d',
        toBlock: '18688016',
        priceLastChangedAtBlock: '18688016',
        verifiedContract: true
      }
    ]
  }

  return {
    $eth,
    getTransactions,
    getLatestBlockNumber,
    getQuantityByValue,
    weiToNumber,
    getBlocksFilterByDate,
    getEthLastPrice,
    _temp_transactions,
    _temp_actual_prices,
    _temp_historycal_price
  }
}
