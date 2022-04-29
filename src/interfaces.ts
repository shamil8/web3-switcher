import { EventData, } from 'web3-eth-contract';
import { HttpProviderOptions, WebsocketProviderOptions, } from 'web3-core-helpers';
import { AbiItem, } from 'web3-utils';
import { Server, } from '@hapi/hapi';

export interface IBlockTx {
  blockNumber: number,
  txHash: string,
}

export type parseCallbackType = (data: object, isWs: boolean) => Promise<void>;

interface IBaseListener {
  listenerParams: Record<string, any>,
  contractEvents?: string[],
}

export interface IListenerParams extends IBaseListener {
  server: Server,
  address: string,
  firstContractBlock: number,
}

export interface IContractData {
  address: string,
  firstBlock: number,
}

export interface IJobsParams extends IListenerParams {
  net: string,
  data: EventData,
  isWs: boolean,
  contractAddress?: string,
}

export type jobsCallbackType = (params: IJobsParams) => Promise<void>;

export interface IParamsListener extends IBaseListener {
  contractData: IContractData,
  abi: AbiItem[],
  jobs: jobsCallbackType,
}

export interface IParseEventsCore {
  address: string,
  events?: string[],
}

export interface IParseEventsLoopParams extends IParseEventsCore {
  firstContractBlock: number,
}

export interface BlockInfo {
  fromBlock: number,
  toBlock: number,
}

export interface IParseEventsParams extends IParseEventsCore {
  fromBlock: number,
  toBlock?: number | string,
}

export interface IProviders {
  wss?: WebsocketProviderOptions,
  http?: HttpProviderOptions,
}
export interface parseEventsIntervalMs {
  http?: number,
  wss?: number,
}

export interface IUserWeb3Config {
  envProvider: string,
  parseEventsIntervalMs?: parseEventsIntervalMs,
  providersOptions?: IProviders,
  extendProviderErrors?: string[],
  waitingWeb3Response?: number,
  waitingFailReconnect?: number,
  waitingEventParsing?: number,
  parseLimit?: number,
  maxReconnectCount?: number,
}

export interface IWeb3Config extends Required<IUserWeb3Config> {
  providerErrors: string[],
}

export type TAsyncFunction <A, O> = (...args: A[]) => Promise<O>;

export interface IMap<K, V> extends Map<K, V> {
  get(key: K): V;
}
