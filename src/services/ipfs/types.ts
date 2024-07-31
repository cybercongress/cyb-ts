/* eslint-disable import/no-unused-modules */
import { LsResult } from 'ipfs-core-types/dist/src/pin';
import { Option } from 'src/types';

export type CallBackFuncStatus = (a: string) => void;

export enum IPFSNodes {
  EXTERNAL = 'external',
  HELIA = 'helia',
}

export type IpfsNodeType = 'external' | 'helia';

export type IpfsFileStats = {
  type: 'file' | 'directory' | 'raw';
  size?: number | bigint;
  sizeLocal?: number | bigint;
  blocks?: number;
  // mtime?: number;
};

export interface AbortOptions {
  signal?: AbortSignal;
}

export interface CatOptions extends AbortOptions {
  length?: number;
  offset?: number;
}

export type InitOptions = { url: string; libp2p?: any };

export interface IpfsNodeFeatures {
  tcp: boolean;
  webRTC: boolean;
}

export interface IpfsNodeInfo {
  id: string;
  agentVersion: string;
  repoSize: number | bigint;
}

export interface IpfsNodePrperties {
  gatewayUrl?: string;
}

// export interface ExtendedIpfsNode<T extends IpfsNode> {
//   node: T;
//   isConnectedToSwarm: () => Promise<boolean>;
//   reconnectToSwarm: (lastConnectedTimestamp?: number) => Promise<void>;
// }

export type getIpfsUserGatewanAndNodeType = {
  ipfsNodeType: IpfsNodeType | undefined;
  userGateway: string | undefined;
};

export type Uint8ArrayWithMime = {
  mime: string;
  rawData: Uint8Array;
};

export type Uint8ArrayLike =
  | Uint8Array
  | AsyncIterator<Uint8Array>
  | AsyncIterable<Uint8Array>; // | ReadableStream<Uint8Array>

export type IpfsContentSource = 'db' | 'node' | 'gateway';

export type IpfsGatewayContentType = 'video' | 'audio' | 'epub';
export type MimeBasedContentType = 'image' | 'pdf' | 'text' | 'other';
export type IpfsBaseContentType =
  | IpfsGatewayContentType
  | 'image'
  | 'pdf'
  | 'text'
  | 'other';

export type IpfsContentType = IpfsBaseContentType | 'link' | 'html' | 'cid';

export type IPFSContentMeta = IpfsFileStats & {
  blockSizes?: never[]; // ???
  data?: string; // ???
  mime?: string;
  local?: boolean;
  statsTime?: number;
  catTime?: number;
  pinTime?: number;
  contentType?: IpfsContentType;
};

export type IPFSContentDetails = {
  text?: string;
  type?: IpfsContentType;
  content?: string;
  link?: string;
  gateway: boolean;
  cid: string;
};

export type IPFSContentDetailsMutated = IPFSContentDetails & {
  mutation?: 'hidden' | 'modified' | 'error'; // rune pipeline result
  cidBefore?: string;
};

export type IPFSContent = {
  availableDownload?: boolean;
  result?: Uint8ArrayLike;
  cid: string;
  meta: IPFSContentMeta;
  source: IpfsContentSource;
  contentUrl?: string;
  textPreview?: string;
  contentType?: IpfsContentType;
};

export type FetchWithDetailsFunc = (
  cid: string,
  type?: IpfsContentType,
  controller?: AbortController
) => Promise<IPFSContentDetails | undefined>;

export interface IpfsNode {
  readonly nodeType: IpfsNodeType;
  readonly config: IpfsNodePrperties;
  readonly isStarted: boolean;
  init: (options?: InitOptions, libp2p?: any) => Promise<void>;
  stop: () => Promise<void>;
  start: () => Promise<void>;
  cat: (cid: string, options?: CatOptions) => AsyncIterable<Uint8Array>;
  stat: (cid: string, options?: AbortOptions) => Promise<IpfsFileStats>;
  add: (content: File | string, options?: AbortOptions) => Promise<string>;
  pin: (cid: string, options?: AbortOptions) => Promise<string | undefined>;
  ls: () => AsyncIterable<LsResult>;
  info: () => Promise<IpfsNodeInfo>;
  getPeers: () => Promise<string[]>;
  connectPeer(address: string): Promise<boolean>;
}

export interface CybIpfsNode extends IpfsNode {
  isConnectedToSwarm(): Promise<boolean>;
  reconnectToSwarm(forced: Option<boolean>): Promise<void>;
  fetchWithDetails: FetchWithDetailsFunc;
  addContent(content: File | string): Promise<string | undefined>;
}

export type JsonPeerId = {
  id: string;
  privateKey: string;
  publicKey: string;
};

export type IpfsOptsType = {
  ipfsNodeType: IpfsNodeType;
  urlOpts: string;
  userGateway: string;
  peerId: JsonPeerId;
};
