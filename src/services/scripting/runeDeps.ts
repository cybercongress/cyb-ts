import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';
import { CyberClient, SigningCyberClient } from '@cybercongress/cyber-js';
import { RPC_URL } from 'src/constants/config';
import { SenseApi } from 'src/contexts/backend/services/senseApi';
import { Option } from 'src/types';
import { getSearchQuery, searchByHash } from 'src/utils/search/utils';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { getPassportByNickname } from 'src/containers/portal/utils';
import { sendCyberlink } from '../neuron/neuronApi';

import { extractRuneScript } from './helpers';
import { IpfsApi } from '../backend/workers/background/worker';
import { RuneEngine } from './engine';

const createRuneDeps = () => {
  let signingClient: Option<SigningCyberClient>;
  let signer: Option<OfflineSigner>;
  let queryClient: CyberClient;
  let senseApi: SenseApi;
  let address: Option<NeuronAddress>;
  let ipfsApi: Option<IpfsApi>;
  let rune: Option<RuneEngine>;

  (async () => {
    queryClient = await CyberClient.connect(RPC_URL);
  })();

  const init = ({
    mySigner,
    mySigningClient,
    mySenseApi,
    myAddress,
    myIpfsApi,
    myRune,
  }: {
    mySigner: Option<OfflineSigner>;
    mySigningClient: Option<SigningCyberClient>;
    mySenseApi: SenseApi;
    myAddress: Option<NeuronAddress>;
    myIpfsApi: Option<IpfsApi>;
    myRune: Option<RuneEngine>;
  }) => {
    signer = mySigner;
    signingClient = mySigningClient;
    senseApi = mySenseApi;
    address = myAddress;
    ipfsApi = myIpfsApi;
    rune = myRune;
  };

  const graphSearch = async (query: string, page = 0) => {
    const keywordHash = await getSearchQuery(query);

    return searchByHash(queryClient, keywordHash, page);
  };

  const singinClientOrThrow = () => {
    if (!signingClient) {
      throw new Error('signingClient not ready');
    }
    return signingClient;
  };

  const ipfApiOrThrow = () => {
    if (!ipfsApi) {
      throw new Error('ipfsApi not ready');
    }
    return ipfsApi;
  };

  const runeOrThrow = () => {
    if (!rune) {
      throw new Error('rune not ready');
    }
    return rune;
  };

  const getIpfsTextConent = async (cid: string) =>
    ipfApiOrThrow().fetchWithDetails(cid, 'text');

  const cybApi = {
    graphSearch,
    cyberlink: async (from: string, to: string) => {
      if (!address) {
        throw new Error('Connect your wallet first');
      }
      return sendCyberlink(address, from, to, {
        senseApi,
        signingClient: singinClientOrThrow(),
      });
    },
    getPassportByNickname: async (nickname: string) => {
      return getPassportByNickname(nickname, senseApi);
    },
    evalScriptFromIpfs: async (
      cid: ParticleCid,
      funcName: string,
      params = {}
    ) => {
      console.log('js_evalScriptFromIpfs', cid);
      try {
        const result = await getIpfsTextConent(cid);
        if (result?.content === undefined) {
          return { action: 'error', message: 'Particle not found' };
        }
        // in case of soul script is mixed with markdown
        // need to extract pure script
        const pureScript = extractRuneScript(result.content);
        return runeOrThrow().executeFunction(pureScript, funcName, params);
      } catch (e) {
        return { action: 'error', message: e.toString() };
      }
    },
    getIpfsTextConent,
    addContenToIpfs: async (content: string) => {
      return ipfApiOrThrow().addContent(content);
    },
  };

  return { init, cybApi };
};

const runeDeps = createRuneDeps();

// export type EngineDeps = ReturnType<typeof createRuneDeps>;

export default runeDeps;
