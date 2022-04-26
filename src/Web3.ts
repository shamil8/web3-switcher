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
import { NodeUrl, providerProtocol, } from './NodeUrl';
import {
  IUserWeb3Config, IWeb3Config, IListenerParams, IParamsListener,
  IParseEventsLoopParams, IParseEventsParams, jobsCallbackType,
  parseCallbackType, TAsyncFunction, BlockInfo,
} from './interfaces';

/** Init default config */
const TIMED_FUNC_MSG_ERR = 'Time out';
const DEFAULT_PROVIDER_ERRORS = [TIMED_FUNC_MSG_ERR, 'CONNECTION ERROR'];

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
});

export class Web3 extends NodeUrl {
  config: IWeb3Config;

  protected web3: WEB3;

  private readonly walletKey?: string;

  protected contracts: {[address: string]: Contract, };

  protected abortReconnect: boolean;

  constructor(net: string, config: IUserWeb3Config, walletKey?: string) {
    super(net);

    if (!config.envProvider) {
      return;
    }

    this.config = getConfig(config);
    this.contracts = {};
    this.walletKey = walletKey;
    this.initWeb3(config.envProvider);
  }

  /**
   * Handle provider (Init web3)
   */
  protected getProvider(url: string) {
    return url.includes(providerProtocol.https)
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

    for (const address of Object.keys(this.contracts)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.contracts[address] && this.contracts[address].setProvider(providerWS);
    }

    console.log('\x1b[32m%s\x1b[0m', `Changed provider, net: ${this.net}, provider:`, provider);
  }

  private async handleReconnect(): Promise<void | boolean> {
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
      console.error(`Error getBlockNumber in parseEvents, provider: ${this.getUrlProvider()}`, e.message);

      await this.checkProviderError(e, this.getBlockNumber);

      throw new Error(e.message);
    }
  }

  /** Get additional info from blockchain */
  async getBlockAdditionInfo(blockNumber: number): Promise<BlockTransactionString> {
    try {
      return await this.promiseFunc(this.web3.eth.getBlock, blockNumber);
    }
    catch (e) {
      console.error(`Error getBlockAdditionInfo in parseEvents, provider: ${this.getUrlProvider()} `, e.message);

      await this.checkProviderError(e, this.getBlockAdditionInfo, blockNumber);

      throw new Error(e.message);
    }
  }

  /** Get user balance */
  async getUserBalance(address: string, isWei = false): Promise<string> {
    try {
      const balance = await this.promiseFunc(this.web3.eth.getBalance, address);

      return isWei ? this.web3.utils.fromWei(balance) : balance;
    }
    catch (e) {
      console.error(`Error getUserBalance in parseEvents, provider: ${this.getUrlProvider()} `, e.message);

      await this.checkProviderError(e, this.getUserBalance, address, isWei);

      throw new Error(e.message);
    }
  }

  getAccountAddress = (): string => this.web3.eth.accounts.wallet[0].address;

  async getGasPrice(): Promise<string> {
    try {
      const price = await this.promiseFunc(this.web3.eth.getGasPrice);

      return toHex(price);
    }
    catch (e) {
      console.error(`Error getGasPrice in parseEvents, provider: ${this.getUrlProvider()} `, e.message);

      await this.checkProviderError(e, this.getGasPrice);

      throw new Error(e.message);
    }
  }

  createSignature = (data: Mixed[]): Sign => {
    if (!this.walletKey) {
      throw new Error('You need to add wallet key!');
    }

    const solSha = soliditySha3(...data);

    if (!solSha) {
      throw new Error('Got null from soliditySha3.');
    }

    return this.web3.eth.accounts.sign(solSha, this.walletKey);
  };

  recover(messageHash: string, signature: string): string {
    try {
      return this.web3.eth.accounts.recover(messageHash, signature).toLowerCase();
    }
    catch (e) {
      console.log('Recover', e);
      throw e;
    }
  }

  /**
   * Contract methods
   */

  getContract(Abi: AbiItem[], address: string): Contract {
    if (!this.contracts[address]) {
      this.contracts[address] = new this.web3.eth.Contract(Abi, address);
    }

    return this.contracts[address];
  }

  async sendContractMethod(address: string, method: string, ...params: any[]): Promise<any> {
    try {
      const transaction = await this.contracts[address].methods[method](...params);

      const from = this.getAccountAddress();

      const gas = await transaction.estimateGas({ from, });

      console.log('gasLimit in startSalesRound', gas);

      const txInfo = await this.promiseFunc(transaction.send, { from, gas, });

      return txInfo.transactionHash;
    }
    catch (e) {
      console.error(`Error sendContractMethod ${method}, provider: ${this.getUrlProvider()} `, e.message);

      await this.checkProviderError(e, this.sendContractMethod, address, method, ...params);

      throw new Error(e.message);
    }
  }

  async getContractViewMethod(address: string, method: string, ...params: any[]): Promise<any> {
    try {
      return await this.promiseFunc(this.contracts[address].methods[method](...params).call);
    }
    catch (e) {
      console.error(`Error getContractMethod ${method}, provider: ${this.getUrlProvider()} `, e.message);

      await this.checkProviderError(e, this.getContractViewMethod, address, method, ...params);

      throw new Error(e.message);
    }
  }

  /**
   * Web3 listeners and subscribers
   */

  async subscribeAllEvents(address: string, parseCallback: parseCallbackType): Promise<void> {
    try {
      const fromBlock = await this.getBlockNumber();

      this.contracts[address].events.allEvents({ fromBlock, })
        .on('data', parseCallback); // TODO:: CHECK IT!!!
      // .on('error', (err) => {
      //   console.error('eventError in subscribeAllEvents', err);
      //   this.subscribeAllEvents(params);
      // });
    }
    catch (e) {
      console.error('Error in subscribeAllEvents', e.message);

      await this.checkProviderError(e, this.subscribeAllEvents, address, parseCallback);

      console.error('SubscribeAllEvents Cancelled');
    }
  }

  private async parseEventsLoop(params: IParseEventsLoopParams): Promise<void> {
    const {
      intervalMs, address, firstContractBlock, parseCallback, events,
    } = params;

    try {
      while (intervalMs) { // Parsing events
        const [parseInfo] = await ParserInfo.findOrCreate({
          where: { network: this.net, address, }, defaults: { lastBlock: firstContractBlock, },
        });
        const fromBlock = +parseInfo.lastBlock + 1;

        await this.parseEvents({
          address,
          fromBlock,
          parseCallback, // callback function
          events,
        });

        await sleep(intervalMs);
      }
    }
    catch (e) {
      console.error('ParseEventsLoop Cancelled', e.message);
    }
  }

  private async getEvent(address: string, event: string, options: BlockInfo): Promise<EventData[]> {
    try {
      return await this.contracts[address].getPastEvents(event, options);
    }
    catch (e) {
      console.error(`Error in getEvent, provider: ${this.getUrlProvider()}`, e);

      await this.checkProviderError(e, this.getEvent, address, event, options);

      throw new Error(e.message);
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
              await params.parseCallback(item, provider.includes(providerProtocol.https));
            }
            catch (e) {
              console.log(`Error in jobs, Contract ${address} ${this.net} for the event`, item, 'with the Error', e);
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
        console.error(`Error in parseEvents, , provider: ${provider}`, e);
      }

      fromBlock = toBlock;
    }
  }

  private async subscribe(jobsCallback: jobsCallbackType, params: IListenerParams): Promise<void> {
    const hasHttp = this.getUrlProvider().includes(providerProtocol.https);

    const eventData = async (data: any, isWs = true) => await jobsCallback({
      ...params, data, isWs, net: this.net,
    });

    if (!hasHttp) {
      await this.subscribeAllEvents(params.address, eventData);
    }

    this.parseEventsLoop({
      parseCallback: eventData, // (5s or one hour) zero or null can not parsing anything!
      address: params.address,
      intervalMs: minutesToMilliSec(hasHttp ? 1 / 12 : 60),
      firstContractBlock: params.firstContractBlock,
      events: params.contractEvents,
    });
  }

  async listener(server: Server, p: IParamsListener): Promise<void> {
    const address = p.contractData.address.toLowerCase();

    try {
      this.getContract(p.abi, address);

      await this.subscribe(p.jobs, {
        server,
        address,
        firstContractBlock: p.contractData.firstBlock,
        listenerParams: p.listenerParams,
        contractEvents: p.contractEvents,
      });
    }
    catch (e) {
      console.log(`Failed to listen for the contract  ${address}_${this.net}`);
    }
  }

  /**
   * Utils func
   * */
  // eslint-disable-next-line consistent-return
  private async checkProviderError(e: any, callFunc: TAsyncFunction<unknown, unknown>, ...params:
      unknown[]): Promise<any> {
    if (this.config.providerErrors.some((err) => e?.message.includes(err))) {
      await this.handleReconnect();

      return await callFunc(...params);
    }
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
}

export default Web3;
