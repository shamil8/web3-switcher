import { NodeProvider, } from './models';
import { providerProtocol, } from './NodeUrl';

const networks = {
  eth: 'ETH',
  bsc: 'BSC',
  polygon: 'MATIC',
  fantom: 'FANTOM',
  avax: 'AVAX',
  one: 'ONE',
};

const testNetProviders: any[] = [
  {
    protocol: providerProtocol.wss,
    net: networks.bsc,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/bsc/testnet/ws', urlReTry: 4, },
      { url: 'wss://bsc.getblock.io/testnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/bsc/testnet/ws', urlReTry: 4, }
    ],
    reTry: 3,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.bsc,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/bsc/testnet', urlReTry: 2, },
      { url: 'https://data-seed-prebsc-1-s1.binance.org:8545/', urlReTry: 4, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/bsc/testnet', urlReTry: 2, },
      { url: 'https://data-seed-prebsc-2-s1.binance.org:8545/', urlReTry: 3, },
      { url: 'https://data-seed-prebsc-1-s2.binance.org:8545/', urlReTry: 1, },
      { url: 'https://bsc.getblock.io/testnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.eth,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/eth/rinkeby/ws', urlReTry: 3, },
      { url: 'wss://eth.getblock.io/testnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'wss://rinkeby.infura.io/ws/v3/4b69d46bd6564ec2b2fd2e7d969b9125', urlReTry: 4, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/eth/rinkeby/ws', urlReTry: 3, }
    ],
    reTry: 2,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.eth,
    providers: [
      { url: 'https://rinkeby.infura.io/v3/4b69d46bd6564ec2b2fd2e7d969b9125', urlReTry: 4, },
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/eth/rinkeby', urlReTry: 3, },
      { url: 'https://eth.getblock.io/testnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/eth/rinkeby', urlReTry: 3, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.avax,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/avalanche/testnet/ws', urlReTry: 3, },
      { url: 'wss://avax.getblock.io/testnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/avalanche/testnet/ws', urlReTry: 2, }
    ],
    reTry: 2,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.avax,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/avalanche/testnet', urlReTry: 3, },
      { url: 'https://api.avax-test.network/', urlReTry: 3, },
      { url: 'https://avax.getblock.io/testnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/avalanche/testnet', urlReTry: 2, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.polygon,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/polygon/mumbai/ws', urlReTry: 3, },
      { url: 'wss://matic.getblock.io/testnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/polygon/mumbai/ws', urlReTry: 3, }
    ],
    reTry: 2,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.polygon,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/polygon/mumbai', urlReTry: 3, },
      { url: 'https://matic.getblock.io/testnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/polygon/mumbai', urlReTry: 3, }
    ],
    reTry: 1,
    isStop: false,
  }
];

const mainNetProviders: any[] = [
  {
    protocol: providerProtocol.wss,
    net: networks.bsc,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/bsc/mainnet/ws', urlReTry: 3, },
      { url: 'wss://bsc-ws-node.nariox.org:443', urlReTry: 2, },
      { url: 'wss://bsc.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/bsc/mainnet/ws', urlReTry: 3, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.bsc,
    providers: [
      { url: 'https://bsc-dataseed.binance.org/', urlReTry: 2, },
      { url: 'https://bsc-dataseed1.defibit.io/', urlReTry: 2, },
      { url: 'https://bsc.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'https://bsc-dataseed1.ninicoin.io/', urlReTry: 3, },
      { url: 'https://bsc-dataseed2.defibit.io/', urlReTry: 2, },
      { url: 'https://bsc-dataseed3.defibit.io/', urlReTry: 1, },
      { url: 'https://bsc-dataseed4.defibit.io/', urlReTry: 1, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.eth,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/eth/mainnet/ws', urlReTry: 2, },
      { url: 'wss://mainnet.infura.io/ws/v3/4b69d46bd6564ec2b2fd2e7d969b9125', urlReTry: 3, },
      { url: 'wss://eth.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/eth/mainnet/ws', urlReTry: 3, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.eth,
    providers: [
      { url: 'https://mainnet.infura.io/v3/4b69d46bd6564ec2b2fd2e7d969b9125', urlReTry: 3, },
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/eth/mainnet', urlReTry: 2, },
      { url: 'https://eth.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 2, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/eth/mainnet', urlReTry: 2, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.avax,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/avalanche/mainnet/ws', urlReTry: 2, },
      { url: 'wss://avax.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/avalanche/mainnet/ws', urlReTry: 2, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.avax,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/avalanche/mainnet', urlReTry: 2, },
      { url: 'https://avax.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/avalanche/mainnet', urlReTry: 2, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.polygon,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/polygon/mainnet/ws', urlReTry: 2, },
      { url: 'wss://matic.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/polygon/mainnet/ws', urlReTry: 2, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.polygon,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/polygon/mainnet', urlReTry: 2, },
      { url: 'https://matic.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/polygon/mainnet', urlReTry: 2, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.fantom,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/fantom/mainnet/ws', urlReTry: 2, },
      { url: 'wss://ftm.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/fantom/mainnet/ws', urlReTry: 2, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.fantom,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/fantom/mainnet', urlReTry: 2, },
      { url: 'https://ftm.getblock.io/mainnet/?api_key=0eff5bdc-ee5d-4ac1-8575-1acc9bcafaff', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/fantom/mainnet', urlReTry: 2, }
    ],
    reTry: 1,
    isStop: false,
  }
];

interface IProvidersInit {
    isTestNet?: boolean,
    providers?: any[],
}

export default async function createDbProvider({ isTestNet = true, providers = isTestNet ? testNetProviders : mainNetProviders, }: IProvidersInit = {}): Promise<void> {
  await NodeProvider.bulkCreate(providers);
}
