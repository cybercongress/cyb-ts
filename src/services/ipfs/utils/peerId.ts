import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromKeys } from '@libp2p/peer-id';
import { JsonPeerId } from '../types';

async function createJsonPeerId(): Promise<JsonPeerId> {
  const peerId = await createEd25519PeerId();

  return {
    id: peerId.toString(),
    privateKey: Buffer.from(peerId.privateKey).toString('base64'),
    publicKey: Buffer.from(peerId.publicKey).toString('base64'),
  };
}

export async function getOrCreatePeerIdJson(): Promise<JsonPeerId> {
  const peerIdString = localStorage.getItem('peerId');
  if (peerIdString) {
    const peerIdJson = JSON.parse(peerIdString);
    console.log(`* current peerId: ${peerIdJson.id}`);
    return peerIdJson;
  }

  const peerIdJson = await createJsonPeerId();
  console.log(`* create new peerId: ${peerIdJson.id}`);
  localStorage.setItem('peerId', JSON.stringify(peerIdJson));

  return peerIdJson;
}

export async function jsonToPeerId(peerIdJson: JsonPeerId) {
  return peerIdFromKeys(
    Buffer.from(peerIdJson.publicKey, 'base64'),
    Buffer.from(peerIdJson.privateKey, 'base64')
  );
}

export const getPeerIdFromMultiaddresString = (address: string) =>
  address.split('/').pop();

// async function getOrCreatePeerId() {
//   const peerIdJson = await getOrCreatePeerIdJson();
//   return peerIdFromKeys(
//     Buffer.from(peerIdJson.publicKey, 'base64'),
//     Buffer.from(peerIdJson.privateKey, 'base64')
//   );
// }
