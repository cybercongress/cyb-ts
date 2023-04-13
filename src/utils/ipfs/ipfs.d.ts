/* eslint-disable import/no-unused-modules */
import { IPFS, IPFSPath } from 'kubo-rpc-client/types';

export type CallBackFuncStatus = (a: string) => void;

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
  data?: string; // ???
  mime?: string;
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

export type IPFSContentDetails =
  | {
      text?: string;
      type?: 'image' | 'pdf' | 'link' | 'text';
      content?: string;
      link?: string;
      gateway: boolean;
    }
  | undefined;

export type IPFSContent = {
  availableDownload?: boolean;
  stream?: ReadableStream<Uint8Array>; //IPFSContentDetails;
  cid: IPFSPath;
  meta?: IPFSContentMeta;
};

export type IPFSContentMaybe = IPFSContent | undefined;
