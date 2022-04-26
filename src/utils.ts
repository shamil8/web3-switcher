/** Convert minutes to milliseconds */
import { NodeProvider, } from './models';
import { providerProtocol, } from './NodeUrl';

export const minutesToMilliSec = (minutes: number): number => minutes * 60 * 1000;

export const sleep = (ms: number)
  // eslint-disable-next-line no-promise-executor-return
  : Promise<void> => new Promise((res) => setTimeout(res, ms));

export const networks = {
  eth: 'ETH',
  bsc: 'BSC',
  polygon: 'MATIC',
  fantom: 'FANTOM',
  avax: 'AVAX',
  one: 'ONE',
};

const testNetProviders: NodeProvider[] = [
  {
    protocol: providerProtocol.wss,
    net: networks.bsc,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/bsc/testnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/bsc/testnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/bsc/testnet/ws', urlReTry: 1, }
    ],
    reTry: 2,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.bsc,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/bsc/testnet', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/bsc/testnet', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/bsc/testnet', urlReTry: 1, },
      { url: 'https://data-seed-prebsc-1-s1.binance.org:8545/', urlReTry: 1, },
      { url: 'https://data-seed-prebsc-2-s1.binance.org:8545/', urlReTry: 1, },
      { url: 'https://data-seed-prebsc-1-s2.binance.org:8545/', urlReTry: 1, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.eth,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/eth/rinkeby/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/eth/rinkeby/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/eth/rinkeby/ws', urlReTry: 1, }
    ],
    reTry: 2,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.eth,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/eth/rinkeby', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/eth/rinkeby', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/eth/rinkeby', urlReTry: 1, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.avax,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/avalanche/testnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/avalanche/testnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/avalanche/testnet/ws', urlReTry: 1, }
    ],
    reTry: 2,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.avax,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/avalanche/testnet', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/avalanche/testnet', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/avalanche/testnet', urlReTry: 1, }
    ],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.polygon,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/polygon/mumbai/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/polygon/mumbai/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/polygon/mumbai/ws', urlReTry: 1, }
    ],
    reTry: 2,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.polygon,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/polygon/mumbai', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/polygon/mumbai', urlReTry: 1, },
      { url: 'https://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/polygon/mumbai', urlReTry: 1, }
    ],
    reTry: 1,
    isStop: false,
  }
];

const mainNetProviders: NodeProvider[] = [
  {
    protocol: providerProtocol.wss,
    net: networks.bsc,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/bsc/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/bsc/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/bsc/mainnet/ws', urlReTry: 1, },
      { url: 'wss://bsc-ws-node.nariox.org:443', urlReTry: 1, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.bsc,
    providers: [
      { url: 'https://bsc-dataseed.binance.org/', urlReTry: 1, },
      { url: 'https://bsc-dataseed1.defibit.io/', urlReTry: 1, },
      { url: 'https://bsc-dataseed1.ninicoin.io/', urlReTry: 1, },
      { url: 'https://bsc-dataseed2.defibit.io/', urlReTry: 1, },
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
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/eth/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/eth/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/eth/mainnet/ws', urlReTry: 1, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.eth,
    providers: [],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.avax,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/avalanche/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/avalanche/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/avalanche/mainnet/ws', urlReTry: 1, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.avax,
    providers: [],
    reTry: 1,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.polygon,
    providers: [
      { url: 'wss://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/polygon/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/polygon/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/polygon/mainnet/ws', urlReTry: 1, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.polygon,
    providers: [],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.wss,
    net: networks.fantom,
    providers: [
      { url: 'https://speedy-nodes-nyc.moralis.io/fccdf9859b01b1207f2da3d8/fantom/mainnet', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/1f3f01f3c302c37a2e211bdc/fantom/mainnet/ws', urlReTry: 1, },
      { url: 'wss://speedy-nodes-nyc.moralis.io/b92124433ab3d3ebfbd29802/fantom/mainnet/ws', urlReTry: 1, }
    ],
    reTry: 5,
    isStop: false,
  },
  {
    protocol: providerProtocol.https,
    net: networks.fantom,
    providers: [],
    reTry: 5,
    isStop: false,
  }
];

interface IProvidersInit {
    isTestNet?: boolean,
    providers?: NodeProvider[],
}

export async function createDbProvider({ isTestNet = true, providers = isTestNet ? testNetProviders : mainNetProviders, }: IProvidersInit = {}): Promise<void> {
  await NodeProvider.bulkCreate(providers);
}
