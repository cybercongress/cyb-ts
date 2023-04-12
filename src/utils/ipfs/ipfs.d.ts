import { IPFS, IPFSPath } from 'kubo-rpc-client/types';

export type CallBackFuncStatus = (a: string) => void;

export type IPFSMaybe = IPFS | null;

type IPFSNodeType = 'emdedded' | 'external';

export type getIpfsUserGatewanAndNodeType = {
  ipfsNodeType: IPFSNodeType | undefined;
  userGateway: string | undefined;
};

export type IPFSContentMeta = {
  type: 'file' | 'dir';
  size: number;
  blockSizes: never[];
  data: string | null;
};

type IPFSData =
  | Blob
  | Buffer
  | string
  | ReadableStream<Uint8Array>
  | Uint8Array
  | File
  | Blob[];

type IPFSContentWithType =
  | {
      text: string | undefined;
      type: 'image' | 'application/pdf' | 'link' | 'text' | undefined;
      content: string;
      link: string;
      gateway: boolean;
    }
  | undefined;

export type IPFSContent = {
  data: IPFSContentWithType;
  cid: IPFSPath;
  meta: IPFSContentMeta;
};

type IPFSContentStatus = 'availableDownload' | undefined;

export type IPFSContentMaybe = IPFSContent | IPFSContentStatus;
