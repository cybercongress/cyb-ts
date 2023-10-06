import { Helia, Pin, createHelia } from 'helia';
import { IDBBlockstore } from 'blockstore-idb';
import { IDBDatastore } from 'datastore-idb';
import { Libp2p, createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { UnixFS, unixfs, AddOptions } from '@helia/unixfs';
import { bootstrap } from '@libp2p/bootstrap';
import { webRTC } from '@libp2p/webrtc';
import { webSockets } from '@libp2p/websockets';
import { identifyService } from 'libp2p/identify';
import { multiaddr } from '@multiformats/multiaddr';
import type { CID, Version as CIDVersion } from 'multiformats/cid';

import {
  AbortOptions,
  CatOptions,
  IpfsNodeType,
  IpfsFileStats,
  IpfsNode,
} from '../../ipfs';
// import { all } from '@libp2p/websockets/filters';
import { stringToCid } from '../../utils/cid';
import { LsResult } from 'ipfs-core-types/src/pin';

const libp2pFactory = async (
  datastore: IDBDatastore,
  bootstrapList: string[] = []
) => {
  const libp2p = await createLibp2p({
    datastore,
    // addresses: {
    //   listen: [
    //     '/ip4/127.0.0.1/tcp/0',
    //     '/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB',
    //   ],
    // },
    transports: [webSockets()], // [webSockets({ filter: all })], //, webRTC()
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    peerDiscovery: [
      bootstrap({
        list: bootstrapList,
      }),
    ],
    services: {
      identify: identifyService(),
    },
  });
  return libp2p;
};

const addOptionsV0: Partial<AddOptions> = {
  cidVersion: 0,
  rawLeaves: false,
};

class HeliaNode implements IpfsNode {
  readonly nodeType: IpfsNodeType = 'helia';

  private node?: Helia;

  private fs?: UnixFS;

  async init() {
    const blockstore = new IDBBlockstore('helia-bs');
    await blockstore.open();

    const datastore = new IDBDatastore('helia-ds');
    await datastore.open();

    const bootstrapList = [
      '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
      '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
      '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
      '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
      '/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB',
    ];
    const libp2p = await libp2pFactory(datastore, bootstrapList);

    this.node = await createHelia({ blockstore, datastore, libp2p });

    this.fs = unixfs(this.node);

    if (typeof window !== 'undefined') {
      window.libp2p = libp2p;
      window.node = this.node;
      window.fs = this.fs;
      window.toCid = stringToCid;
    }

    // DEBUG
    libp2p.addEventListener('peer:connect', (evt) => {
      console.log(`Connected to ${evt.detail.toString()}`);
    });
    libp2p.addEventListener('peer:disconnect', (evt) => {
      console.log(`Disconnected from ${evt.detail.toString()}`);
    });
  }

  async stat(cid: string, options: AbortOptions = {}): Promise<IpfsFileStats> {
    return this.fs!.stat(stringToCid(cid), options).then((result) => {
      const { type, fileSize, localFileSize, blocks, dagSize, mtime } = result;
      return {
        type,
        size: fileSize || -1,
        sizeLocal: localFileSize || -1,
        blocks,
      };
    });
  }

  cat(cid: string, options: CatOptions = {}) {
    return this.fs!.cat(stringToCid(cid), options);
  }

  async add(content: File | string, options: AbortOptions = {}) {
    // Options to keep CID in V0 format 'Qm....';
    const optionsV0 = {
      ...options,
      ...addOptionsV0,
    } as Partial<AddOptions>;

    let cid;

    if (content instanceof File) {
      const fileName = content.name;
      const arrayBuffer = await content.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      cid = await this.fs!.addFile(
        { path: fileName, content: data },
        optionsV0
      );
    } else {
      const data = new TextEncoder().encode(content);
      cid = await this.fs!.addBytes(data, optionsV0);
    }
    console.log('----added to helia', cid.toString());
    this.pin(cid.toString(), options);
    return cid.toString();
  }

  async pin(cid: string, options: AbortOptions = {}) {
    const cid_ = stringToCid(cid);
    const isPinned = await this.node?.pins.isPinned(cid_, options);
    if (!isPinned) {
      const pinResult = (
        await this.node?.pins.add(cid_, options)
      )?.cid.toString();
      console.log('------pin', pinResult);
    }
    console.log('------pinned', cid, isPinned);
    return undefined;
  }

  async getPeers() {
    return this.node!.libp2p!.getConnections().map((c) =>
      c.remotePeer.toString()
    );
  }

  async stop() {
    await this.node?.stop();
  }

  async start() {
    await this.node?.start();
  }

  async connectPeer(address: string) {
    const conn = await this.node!.libp2p!.dial(multiaddr(address));
    return true;
  }

  private async *mapToLsResult(
    iterable: AsyncIterable<Pin>
  ): AsyncIterable<LsResult> {
    for await (const item of iterable) {
      const { cid, metadata } = item;
      yield { cid: cid.toV0(), metadata, type: 'recursive' };
    }
  }
  ls() {
    const result = this.mapToLsResult(this.node!.pins.ls());
    return result;
  }

  async info() {
    const id = this.node!.libp2p.peerId.toString();
    const agentVersion = this.node!.libp2p!.services!.identify!.host!
      .agentVersion as string;
    return { id, agentVersion, repoSize: -1 };
  }
}

// eslint-disable-next-line import/no-unused-modules
export default HeliaNode;
