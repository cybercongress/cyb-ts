/* eslint-disable import/no-unused-modules */
import { IPFS } from 'kubo-rpc-client/types';
import { IPFSHTTPClient } from 'kubo-rpc-client/dist/src';

export type CallBackFuncStatus = (a: string) => void;

export type NodeType = 'external' | 'embedded';

export type IpfsOptsType = {
  ipfsNodeType: NodeType;
  urlOpts: string;
};

export type AppIPFS = (IPFS | IPFSHTTPClient) & {
  nodeType: NodeType;
  swarmConnTimeout: number;
  gatewayAddr: string;
};

export type IpfsContentType =
  | 'image'
  | 'pdf'
  | 'link'
  | 'text'
  | 'xml'
  | 'video'
  | 'html'
  | 'cid'
  | 'other'
  | 'particle'
  | 'html'
  | 'directory'
  | 'unknown';

export type IPFSContentMeta = {
  type?: 'file' | 'directory';
  size: number;
  blockSizes?: never[]; // ???
  blocks?: number;
  data?: string; // ???
  mime?: string;
  local?: boolean;
  statsTime?: number;
  catTime?: number;
  pinTime?: number;
};

type IPFSData =
  | Blob
  | Buffer
  | string
  | ReadableStream<Uint8Array>
  | Uint8Array
  | File
  | Blob[];

export type Uint8ArrayWithMime = {
  mime: string;
  rawData: Uint8Array;
};

export type IpfsRawDataResponse =
  | ReadableStream<Uint8Array>
  | Uint8Array
  | AsyncIterator<Uint8Array>;

export type IpfsContentSource = 'db' | 'node' | 'gateway';

export type IPFSContentDetails =
  | {
      text?: string;
      type?: IpfsContentType;
      content?: string;
      link?: string;
      gateway: boolean;
      cid: string;
    }
  | undefined;

export type IPFSContent = {
  availableDownload?: boolean;
  result?: IpfsRawDataResponse;
  cid: string;
  meta: IPFSContentMeta;
  contentType: IpfsContentType;
  source: IpfsContentSource;
  contentUrl?: string;
  modified?: boolean;
};

export type IPFSContentMaybe = IPFSContent | undefined;
