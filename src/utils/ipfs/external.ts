import { create as IpfsHttpClient } from 'kubo-rpc-client';

export async function init(opts) {
  console.log(`init with IPFS API at ${opts.urlOpts}`);

  try {
    const api = IpfsHttpClient(opts.urlOpts);
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

export async function destroy() {
  console.log('destroy');
  // clearInterval(timeintervalPeer);
}
