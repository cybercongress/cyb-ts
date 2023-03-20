import { create as IpfsHttpClient } from 'kubo-rpc-client';
import { multiaddr } from '@multiformats/multiaddr';

let timeintervalPeer;

export async function init(opts) {
  console.log(`init with IPFS API at ${opts.urlOpts}`);

  try {
    const api = await IpfsHttpClient(opts.urlOpts);
    // getPeers(api, opts);
    try {
      const peers = await api.swarm.peers();
      console.log('peers', peers.length);
    } catch (err) {
      throw new Error(`err swarm peers connect`);
    }
    return api;
  } catch (err) {
    throw new Error(`err init IpfsHttpClient`);
  }
}

const getPeers = async (api, opts) => {
  timeintervalPeer = setInterval(async () => {
    try {
      const peers = await api.swarm.peers();
      console.log('peers', peers.length);
    } catch (err) {
      await init(opts);
    }
  }, 5000);
};

export async function destroy() {
  console.log('destroy');
  // clearInterval(timeintervalPeer);
}
