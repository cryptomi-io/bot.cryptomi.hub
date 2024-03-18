import { Alchemy, Network } from 'alchemy-sdk'

const config = {
  apiKey: 'demo',
  network: Network.ETH_MAINNET
}
const $alchemy = new Alchemy(config)
export default $alchemy
