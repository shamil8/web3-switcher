// eslint-disable-next-line import/no-extraneous-dependencies
import { EventData, } from 'web3-eth-contract';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HttpProviderOptions, WebsocketProviderOptions, } from 'web3-core-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies
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
  parseCallback: parseCallbackType,
  events?: string[],
}

export interface IParseEventsLoopParams extends IParseEventsCore {
  firstContractBlock: number,
  intervalMs: number | null,
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

export interface IUserWeb3Config {
  envProvider: string,
  providersOptions?: IProviders,
  EXTENDED_PROVIDERS_ERRORS? :string[],
  WAITING_WEB3_RESPONSE?: number,
  WAITING_FAIL_RECONNECT?: number,
  WAITING_EVENT_PARSING?: number,
  PARSE_LIMIT?: number,
  MAX_RECONNECT_COUNT?: number,
}

export interface IWeb3Config extends Required<IUserWeb3Config> {
  PROVIDERS_ERRORS:string[],
}

export type TAsyncFunction <A, O> = (...args: A[]) => Promise<O>;
