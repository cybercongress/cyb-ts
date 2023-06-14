import { CyberClient } from '@cybercongress/cyber-js';
import { initSync } from 'rune';
import { getPassportByNickname } from 'src/containers/portal/utils';

import {
  runScript,
  loadCyberScripingEngine,
  reactToParticle,
  setCyberClient,
} from './engine';

// import { enableFetchMocks } from 'jest-fetch-mock';
import { readFileSync } from 'fs';

initSync(readFileSync('./rune_build/index_bg.wasm'));

jest.mock('src/containers/portal/utils', () => ({
  getPassportByNickname: jest.fn(),
}));

// Read the .wasm file to memory

// enableFetchMocks();
// fetch.mockResponse(async (request) => {
//   if (request.url.endsWith('index_bg.wasm')) {
//     return {
//       status: 200,
//       body: file,
//     };
//   }
//   return {
//     status: 404,
//     body: 'Not Found',
//   };
// });

describe('Script executor', () => {
  beforeAll(async () => {
    await loadCyberScripingEngine();
  });

  it('should execute 1+1 script', async () => {
    const scriptCode = `
    pub async fn main() {
      1+1
    }`;
    const result = await runScript(scriptCode, {}, console.log);
    expect(result.error).toBeNull();
    expect(result.result).toEqual(2);
  });

  it('should execute react to particle script and return <username>.moon particle content', async () => {
    const newCid = 'new_cid';
    const cid = 'QmakRbRoKh5Nss8vbg9qnNN2Bcsr7jUX1nbDeMT5xe8xa1';
    const contentType = 'particle';
    const preview = 'dasein.moon';
    setCyberClient({} as CyberClient);

    (getPassportByNickname as jest.Mock).mockResolvedValueOnce({
      extension: {
        particle: newCid,
      },
    });
    // CID with dasein.moon content

    const result = await reactToParticle(cid, contentType, preview);
    expect(result.action).toBe('update_cid');
    expect(result.cid).toEqual(newCid);
  });
});
