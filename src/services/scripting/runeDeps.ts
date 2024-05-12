import { ProxyMarked, Remote } from 'comlink';

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
import { IpfsApi, MlApi } from '../backend/workers/background/worker';
import { RuneEngine } from './engine';

type InternalDeps = {
  ipfsApi?: Option<IpfsApi>;
  rune?: Option<RuneEngine>;
  queryClient?: Option<CyberClient>;
  mlApi?: Option<MlApi>;
};
type ExternalDeps = {
  signingClient?: Option<SigningCyberClient & ProxyMarked>;
  // signer?: Option<OfflineSigner>;
  senseApi?: Option<SenseApi & ProxyMarked>;
  address?: Option<NeuronAddress>;
};

type Deps = InternalDeps & ExternalDeps;

const createRuneDeps = () => {
  const deps: Deps = {};
  // let signingClient: Option<SigningCyberClient>;
  // let signer: Option<OfflineSigner>;
  // let queryClient: CyberClient;
  // let senseApi: SenseApi;
  // let address: Option<NeuronAddress>;
  // let ipfsApi: Option<IpfsApi>;
  // let rune: Option<RuneEngine>;

  (async () => {
    deps.queryClient = await CyberClient.connect(RPC_URL);
  })();

  const setExternalDeps = (externalDeps: ExternalDeps) => {
    Object.keys(externalDeps)
      .filter((name) => externalDeps[name as keyof ExternalDeps] !== undefined)
      .forEach((name) => {
        deps[name as keyof Deps] = externalDeps[name as keyof ExternalDeps];
      });
  };

  const setInternalDeps = (internalDeps: InternalDeps) => {
    Object.keys(internalDeps)
      .filter((name) => internalDeps[name as keyof InternalDeps] !== undefined)
      .forEach((name) => {
        deps[name as keyof Deps] = internalDeps[name as keyof InternalDeps];
      });
  };

  const graphSearch = async (query: string, page = 0) => {
    const queryClient = depOrThrow('queryClient') as CyberClient;

    const keywordHash = await getSearchQuery(query);

    return searchByHash(queryClient, keywordHash, page);
  };

  const depOrThrow = (name: keyof Deps) => {
    if (!deps[name]) {
      throw new Error(`${name} is not set!`);
    }
    return deps[name] as Deps[typeof name];
  };

  const singinClientOrThrow = () => {
    if (!deps.signingClient) {
      throw new Error('signingClient not ready');
    }
    return deps.signingClient;
  };

  const ipfApiOrThrow = () => {
    if (!deps.ipfsApi) {
      throw new Error('ipfsApi not ready');
    }
    return deps.ipfsApi;
  };

  const runeOrThrow = () => {
    if (!deps.rune) {
      throw new Error('rune not ready');
    }
    return deps.rune;
  };

  const getIpfsTextConent = async (cid: string) =>
    ipfApiOrThrow().fetchWithDetails(cid, 'text');

  const evalScriptFromIpfs = async (
    cid: ParticleCid,
    funcName: string,
    params = {}
  ) => {
    try {
      // console.log(
      //   'js_evalScriptFromIpfs',
      //   cid,
      //   funcName,
      //   params,
      //   ipfApiOrThrow(),
      //   runeOrThrow()
      // );
      const result = await getIpfsTextConent(cid);
      console.log('js_evalScriptFromIpfs particle ', cid, result);

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
  };

  const cybApi = {
    graphSearch,
    cyberlink: async (from: string, to: string) => {
      if (!deps.address) {
        throw new Error('Connect your wallet first');
      }
      return sendCyberlink(deps.address, from, to, {
        senseApi: depOrThrow('senseApi') as SenseApi,
        signingClient: singinClientOrThrow(),
      });
    },
    getPassportByNickname: async (nickname: string) => {
      const passport = await getPassportByNickname(deps.queryClient, nickname);

      return passport;
    },
    searcByEmbedding: async (text: string, count = 10) =>
      (depOrThrow('mlApi') as MlApi).searchByEmbedding(text, count),
    evalScriptFromIpfs,
    getIpfsTextConent,
    addContenToIpfs: async (content: string) => {
      return ipfApiOrThrow().addContent(content);
    },
  };

  return { setExternalDeps, setInternalDeps, cybApi };
};

const runeDeps = createRuneDeps();

export type RuneDeps = typeof runeDeps;

// export type EngineDeps = ReturnType<typeof createRuneDeps>;

export default runeDeps;
