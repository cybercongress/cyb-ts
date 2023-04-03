import * as external from './external';
import * as embedded from './embedded';

let client;

export async function initIpfsClient(opts) {
  let backend;

  switch (opts.ipfsNodeType) {
    case 'embedded':
      backend = embedded;
      break;
    case 'external':
      backend = external;
      break;

    default:
      throw new Error(`Unsupported ipfsNodeType: ${opts.ipfsNodeType}`);
  }

  const instance = await backend.init(opts);
  client = backend;
  return instance;
}

export async function destroyIpfsClient() {
  if (!client) {
    return;
  }

  try {
    await client.destroy();
  } finally {
    client = null;
  }
}
