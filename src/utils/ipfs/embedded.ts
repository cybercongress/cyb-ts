import { create } from 'ipfs-core';
import type { AppIPFS } from './ipfs';

import configIpfs from './configIpfs';

let node: null | AppIPFS = null;

export async function init() {
  if (node !== null) {
    console.log('IPFS already started');
  } else if (window.ipfs && window.ipfs.enable) {
    console.log('Found window.ipfs');
    node = await window.ipfs.enable({ commands: ['id'] });
  } else {
    try {
      // await deleteStore(path);
      console.time('IPFS Started');
      node = await create(configIpfs());
      node.nodeType = 'embedded';
      console.timeEnd('IPFS Started');
    } catch (error) {
      console.error('IPFS init error:', error);
      node = null;
      throw new Error(`init embedded type ${error}`);
    }
  }

  return node;
}

export async function destroy() {
  console.log('destroy');
  if (!node) {
    return;
  }

  console.log('node', node);
  await node.stop();
  node = null;
}
