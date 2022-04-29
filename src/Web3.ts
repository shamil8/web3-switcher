import WEB3 from 'web3';
import { Server, } from '@hapi/hapi';
import {
  AbiItem, toHex, soliditySha3, Mixed,
} from 'web3-utils';
import { Sign, } from 'web3-core';
import { BlockTransactionString, } from 'web3-eth';
import { Contract, EventData, } from 'web3-eth-contract';
import { ParserInfo, } from './models';
import { minutesToMilliSec, sleep, } from './utils';
import NodeUrl, { providerProtocol, } from './NodeUrl';
import {
  IUserWeb3Config, IWeb3Config, IListenerParams,
  IParamsListener, IParseEventsLoopParams, IParseEventsParams,
  jobsCallbackType, TAsyncFunction, BlockInfo, parseCallbackType,
} from './interfaces';

/** Init default config */
const TIMED_FUNC_MSG_ERR = 'Time out';
const DEFAULT_PROVIDER_ERRORS = [TIMED_FUNC_MSG_ERR, 'CONNECTION ERROR', 'Invalid JSON RPC response: ""', 'block range can not exceed'];

const getConfig = ({
  envProvider,
  providersOptions = {
    wss: {
      timeout: minutesToMilliSec(1),
      clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
      },
      reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 15,
        onTimeout: false,
      },
    },
    http: {
      timeout: minutesToMilliSec(0.3),
    },
  },
  extendProviderErrors = [],
  waitingWeb3Response = minutesToMilliSec(0.1),
  waitingFailReconnect = minutesToMilliSec(0.3),
  waitingEventParsing = 200, // 0.2 secs
  parseLimit = 5000, // parsing limit count in many networks (probably 8k better use 6k)
  maxReconnectCount = 5,
  parseEventsIntervalMs = {
    wss: minutesToMilliSec(60),
    http: minutesToMilliSec(1 / 12),
  },
} : IUserWeb3Config = { envProvider: '', }): IWeb3Config => ({
  envProvider,
  providersOptions,
  extendProviderErrors,
  providerErrors: [...new Set([...extendProviderErrors, ...DEFAULT_PROVIDER_ERRORS])],
  waitingWeb3Response,
  waitingFailReconnect,
  waitingEventParsing,
  parseLimit,
  maxReconnectCount,
  parseEventsIntervalMs,
});

interface IMap<K, V> extends Map<K, V> {
  get(key: K): V;
}

export class Web3 extends NodeUrl {
  config: IWeb3Config;

  static readonly utils = WEB3.utils;

  static readonly web3Version = WEB3.version;

  static modules = WEB3.modules;

  static readonly utils = WEB3.utils;

  static readonly web3Version = WEB3.version;

  static modules = WEB3.modules;

  private readonly walletKey?: string;

  protected web3: WEB3;

  protected contracts: IMap<string, Contract>;

  protected eventDataContracts: IMap<string, parseCallbackType>;

  protected timeoutIDParseEventLop: IMap<string, NodeJS.Timeout>;

  protected subscribedContracts: {[address: string]: boolean, };

  protected abortReconnect: boolean;

  protected lastProviderHasHttp: boolean;

  protected hasHttp: boolean;

  constructor(net: string, config: IUserWeb3Config, walletKey?: string) {
    super(net);

    if (!config.envProvider) {
      return;
    }

    this.config = getConfig(config);

    this.contracts = new Map();
    this.eventDataContracts = new Map();
    this.timeoutIDParseEventLop = new Map();
    this.subscribedContracts = {};

    this.walletKey = walletKey;

    this.initWeb3(config.envProvider);
  }

  /**
   * Handle provider (Init web3)
   */
  protected getProvider(url: string) {
    this.hasHttp = url.includes(providerProtocol.https);

    return this.hasHttp
      ? new WEB3.providers.HttpProvider(url, this.config.providersOptions.http)
      : new WEB3.providers.WebsocketProvider(url, this.config.providersOptions.wss);
  }

  private initWeb3(provider: string) {
    this.web3 = new WEB3(this.getProvider(provider));

    if (this.walletKey) {
      const account = this.web3.eth.accounts.privateKeyToAccount(this.walletKey);
      this.web3.eth.accounts.wallet.add(account);
      this.web3.eth.defaultAccount = account.address;
    }

    console.log('\x1b[32m%s\x1b[0m', `Init web3, net: ${this.net}, provider:`, provider);
  }

  private setProvider(provider: string): void {
    const providerWS = this.getProvider(provider);
    this.web3.setProvider(providerWS);

    for (const address of this.contracts.keys()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.contracts.has(address) && this.contracts.get(address).setProvider(providerWS);
    }

    console.log('\x1b[32m%s\x1b[0m', `Changed provider, net: ${this.net}, provider:`, provider);
  }

  private async handleReconnect(): Promise<void | boolean> {
    this.lastProviderHasHttp = this.getUrlProvider().includes(providerProtocol.https);

    if (this.abortReconnect) {
      this.config.maxReconnectCount -= 1;
      this.config.maxReconnectCount < 1 && await sleep(this.config.waitingFailReconnect);

      return;
    }

    const provider = await this.getNewProvider();

    if (!provider) {
      this.abortReconnect = !provider;

      return;
    }

    this.setProvider(provider);

    if (this.hasHttp !== this.lastProviderHasHttp) {
      for (const [key, value] of this.timeoutIDParseEventLop) {
        clearTimeout(value);
        this.timeoutIDParseEventLop.delete(key);
      }
    }

    if (!this.hasHttp) {
      for (const [address, isSub] of Object.entries(this.subscribedContracts)) {
        !isSub && await this.subscribeAllEvents(address);
      }
    }
  }

  /** Update provider from rout */
  async updateProvider(provider: string): Promise<boolean> {
    this.setProvider(provider);

    return await this.checkConnection();
  }

  getUrlProvider(): string {
    const provider = this.web3.currentProvider as unknown as { host: string, url: string, };

    return provider.url || provider.host;
  }

  /**
   * Web3 methods
   */

  public async checkConnection(): Promise<boolean> {
    try {
      return !!(await this.promiseFunc(this.web3.eth.getBlockNumber));
    }
    catch (e) {
      return false;
    }
  }

  /** Get last block from blockchain */
  async getBlockNumber(): Promise<number> {
    try {
      return await this.promiseFunc(this.web3.eth.getBlockNumber);
    }
    catch (e) {
      return await this.checkProviderError(e.message, this.getBlockNumber.name);
    }
  }

  /** Get additional info from blockchain */
  async getBlockAdditionInfo(blockNumber: number): Promise<BlockTransactionString> {
    try {
      return await this.promiseFunc(this.web3.eth.getBlock, blockNumber);
    }
    catch (e) {
      return await this.checkProviderError(e.message, this.getBlockAdditionInfo.name, blockNumber);
    }
  }

  /** Get user balance */
  async getUserBalance(address: string, isWei = false): Promise<string> {
    try {
      const balance = await this.promiseFunc(this.web3.eth.getBalance, address);

      return isWei ? this.web3.utils.fromWei(balance) : balance;
    }
    catch (e) {
      return await this.checkProviderError(e.message, this.getUserBalance.name, address, isWei);
    }
  }

  getAccountAddress = (): string => this.web3.eth.accounts.wallet[0].address;

  async getGasPrice(): Promise<string> {
    try {
      const price = await this.promiseFunc(this.web3.eth.getGasPrice);

      return toHex(price);
    }
    catch (e) {
      return await this.checkProviderError(e.message, this.getGasPrice.name);
    }
  }

  createSignature(data: Mixed[]): Sign {
    if (!this.walletKey) {
      throw new Error('You need to add wallet key!');
    }

    const solSha = soliditySha3(...data);

    if (!solSha) {
      throw new Error('Got null from soliditySha3.');
    }

    return this.web3.eth.accounts.sign(solSha, this.walletKey);
  }

  recover(messageHash: string, signature: string): string {
    try {
      return this.web3.eth.accounts.recover(messageHash, signature).toLowerCase();
    }
    catch (e) {
      throw Error(e.message);
    }
  }

  /**
   * Contract methods
   */

  getContract(Abi: AbiItem[], address: string): Contract | undefined {
    if (!this.contracts.has(address)) {
      this.contracts.set(address, new this.web3.eth.Contract(Abi, address));
    }

    return this.contracts.get(address);
  }

  async sendContractMethod(address: string, method: string, ...params: any[]): Promise<any> {
    try {
      const transaction = await this.contracts.get(address).methods[method](...params);

      const from = this.getAccountAddress();

      const gas = await transaction.estimateGas({ from, });

      const txInfo = await this.promiseFunc(transaction.send, { from, gas, });

      return txInfo.transactionHash;
    }
    catch (e) {
      return await this
        .checkProviderError(e.message, this.sendContractMethod.name, address, method, ...params);
    }
  }

  async getContractViewMethod(address: string, method: string, ...params: any[]): Promise<any> {
    try {
      return await this.promiseFunc(this.contracts.get(address).methods[method](...params).call);
    }
    catch (e) {
      return await this
        .checkProviderError(e.message, this.getContractViewMethod.name, address, method, ...params);
    }
  }

  /**
   * Web3 listeners and subscribers
   */

  private async subscribeAllEvents(address: string): Promise<void> {
    if (this.hasHttp || this.subscribedContracts[address]) {
      return;
    }

    try {
      const fromBlock = await this.getBlockNumber();

      this.contracts.get(address).events.allEvents({ fromBlock, })
        .on('data', this.eventDataContracts.get(address));

      this.subscribedContracts[address] = true;

      console.log('\x1b[32m%s\x1b[0m', `subscribeAllEvents successfully in Contract ${address}_${this.net}`);
    }
    catch (e) {
      this.subscribedContracts[address] = false;

      return await this.checkProviderError(e.message, this.subscribeAllEvents.name, address);
    }
  }

  private async parseEventsLoop(params: IParseEventsLoopParams): Promise<void> {
    const { address, firstContractBlock, events, } = params;

    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const [parseInfo] = await ParserInfo.findOrCreate({
          where: { network: this.net, address, }, defaults: { lastBlock: firstContractBlock, },
        });
        const fromBlock = +parseInfo.lastBlock + 1;

        await this.parseEvents({
          address,
          fromBlock,
          events,
        });

        await this.sleepParseEvent(address);
      }
    }
    catch (e) {
      console.error('ParseEventsLoop Cancelled', e.message);
    }
  }

  private async getEvent(address: string, event: string, options: BlockInfo): Promise<EventData[]> {
    try {
      return await this.contracts.get(address).getPastEvents(event, options);
    }
    catch (e) {
      return await this.checkProviderError(e.message, this.getEvent.name, address, event, options);
    }
  }

  private async parseEvents(params: IParseEventsParams): Promise<void> {
    const { address, } = params;
    let { fromBlock, events, } = params;
    const provider = this.getUrlProvider();
    const latest = await this.getBlockNumber();
    const { parseLimit, } = this.config;

    console.log(`parseEvents net: ${this.net}, address: ${address} lastBlockNumber:`, latest);

    for (let toBlock = fromBlock + parseLimit; toBlock <= latest + parseLimit;
      toBlock += parseLimit) {
      const options = {
        fromBlock,
        toBlock: toBlock <= latest ? toBlock : latest,
      };

      console.log('\x1b[35m%s\x1b[0m', `Parse '${this.net}': `, options);

      !events && (events = ['allEvents']);

      if (fromBlock >= options.toBlock) {
        return;
      }

      try {
        for (const event of events) {
          const items = await this.getEvent(address, event, options);

          for (const item of items) {
            // isWS = false meant doesn't need to send socket event!
            try {
              await this.eventDataContracts.get(address)(item, provider.includes(providerProtocol.https));
            }
            catch (e) {
              console.error(`Error in jobs, contract: ${address} ${this.net} for the event`, item, 'with the Error', e);
            }
          }

          await sleep(this.config.waitingEventParsing);
        }

        await ParserInfo.update(
          { lastBlock: options.toBlock, },
          { where: { network: this.net, address, }, }
        );
      }
      catch (e) {
        console.error(`Error in parseEvents, net: ${this.net}, provider: ${provider}`, e);
      }

      fromBlock = toBlock;
    }
  }

  private async subscribe(jobsCallback: jobsCallbackType, params: IListenerParams): Promise<void> {
    this.eventDataContracts.set(params.address, async (data: any, isWs = !this.hasHttp) => await jobsCallback({
      ...params, data, isWs, net: this.net,
    }));

    this.subscribedContracts[params.address] = false;

    const hasHttp = this.getUrlProvider().includes(providerProtocol.https);

    if (!hasHttp) {
      await this.subscribeAllEvents(params.address);
    }

    this.parseEventsLoop({
      hasHttp,
      address: params.address,
      firstContractBlock: params.firstContractBlock,
      events: params.contractEvents,
    });
  }

  async listener(server: Server, p: IParamsListener): Promise<void> {
    const address = p.contractData.address.toLowerCase();
    this.getContract(p.abi, address);

    try {
      await this.subscribe(p.jobs, {
        server,
        address,
        firstContractBlock: p.contractData.firstBlock,
        listenerParams: p.listenerParams,
        contractEvents: p.contractEvents,
      });
    }
    catch (e) {
      console.error(`Failed to listen for the contract  ${address}_${this.net}`);
    }
  }

  /**
   * Utils func
   * */
  private async checkProviderError(msg: string, funcName: string, ...params: unknown[])
      : Promise<any> {
    console.error(`Error in ${funcName}, net: ${this.net}, provider: ${this.getUrlProvider()}, params`, params, msg);

    if (this.config.providerErrors.some((err) => msg.includes(err))) {
      await this.handleReconnect();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return await this[funcName](...params);
    }

    throw new Error(msg);
  }

  async promiseFunc(callFunc: TAsyncFunction<any, any>, ...params: unknown[]): Promise<any> {
    return Promise.race([
      callFunc(...params),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error(`${TIMED_FUNC_MSG_ERR}! more than ${this.config.waitingWeb3Response}`));
        }, this.config.waitingWeb3Response);
      })
    ]);
  }

  // eslint-disable-next-line class-methods-use-this
  sleepParseEvent = (address: string)
      : Promise<void> => new Promise((res) => {
    const timeID = setTimeout(res, this.hasHttp ? this.config.parseEventsIntervalMs.http : this.config.parseEventsIntervalMs.wss);
    this.timeoutIDParseEventLop.set(address, timeID);
  });
}

export default Web3;
