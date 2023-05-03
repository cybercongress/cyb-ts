/* eslint-disable import/no-unused-modules */
import { IPFS, IPFSPath } from 'kubo-rpc-client/types';

export type CallBackFuncStatus = (a: string) => void;

export type NodeType = 'external' | 'embedded';

export type AppIPFS = IPFS & { nodeType: NodeType };

export type IPFSMaybe = IPFS | null;

type IPFSNodeType = 'emdedded' | 'external';

export type getIpfsUserGatewanAndNodeType = {
  ipfsNodeType: IPFSNodeType | undefined;
  userGateway: string | undefined;
};

export type IPFSContentMeta = {
  type: 'file' | 'directory';
  size: number;
  blockSizes?: never[]; // ???
  blocks?: number;
  data?: string; // ???
  mime?: string;
  local?: boolean;
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
export type IpfsContentType =
  | 'image'
  | 'pdf'
  | 'link'
  | 'text'
  | 'video'
  | 'html'
  | 'other';

export type IPFSContentDetails =
  | {
      text?: string;
      type?: IpfsContentType;
      content?: string;
      link?: string;
      gateway: boolean;
      cid: IPFSPath;
    }
  | undefined;

export type IPFSContent = {
  availableDownload?: boolean;
  result?: IpfsRawDataResponse;
  cid: IPFSPath;
  meta: IPFSContentMeta;
  source: IpfsContentSource;
  contentUrl?: string;
};

export type IPFSContentMaybe = IPFSContent | undefined;
