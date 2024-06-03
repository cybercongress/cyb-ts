import { ProxyMarked, Remote } from 'comlink';

import { BehaviorSubject, first } from 'rxjs';
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
  ipfsApi: Option<IpfsApi>;
  rune: Option<RuneEngine>;
  queryClient: Option<CyberClient>;
  mlApi: Option<MlApi>;
};
type ExternalDeps = {
  signingClient: Option<SigningCyberClient & ProxyMarked>;
  // signer?: Option<OfflineSigner>;
  senseApi: Option<SenseApi & ProxyMarked>;
  address: Option<NeuronAddress>;
};

type Deps = InternalDeps & ExternalDeps;

type SubjectDeps<T> = {
  [K in keyof T]: BehaviorSubject<T[K]>;
};

const createRuneDeps = () => {
  const subjectDeps: SubjectDeps<Deps> = {
    // Initialize subjects for each dependency
    ipfsApi: new BehaviorSubject<InternalDeps['ipfsApi']>(undefined),
    rune: new BehaviorSubject<InternalDeps['rune']>(undefined),
    queryClient: new BehaviorSubject<InternalDeps['queryClient']>(undefined),
    mlApi: new BehaviorSubject<Option<InternalDeps['mlApi']>>(undefined),
    signingClient: new BehaviorSubject<ExternalDeps['signingClient']>(
      undefined
    ),
    senseApi: new BehaviorSubject<ExternalDeps['senseApi']>(undefined),
    address: new BehaviorSubject<ExternalDeps['address']>(undefined),
  };

  const defferedDependency = (name: keyof Deps): Promise<Deps[typeof name]> => {
    return new Promise((resolve) => {
      const item$ = subjectDeps[name] as BehaviorSubject<Deps[typeof name]>;

      if (item$.getValue()) {
        resolve(item$.getValue());
      }

      item$
        .pipe(
          first((value) => value !== undefined) // Automatically unsubscribes after the first valid value
        )
        .subscribe((value) => {
          resolve(value);
        });
    });
  };

  (async () => {
    const client = await CyberClient.connect(RPC_URL);
    subjectDeps.queryClient?.next(client);
  })();

  const setExternalDeps = (externalDeps: Partial<ExternalDeps>) => {
    Object.keys(externalDeps)
      .filter((name) => externalDeps[name as keyof ExternalDeps] !== undefined)
      .forEach((name) => {
        const item = externalDeps[name as keyof ExternalDeps];
        subjectDeps[name as keyof Deps].next(item);
      });
  };

  const setInternalDeps = (internalDeps: Partial<InternalDeps>) => {
    Object.keys(internalDeps)
      .filter((name) => internalDeps[name as keyof InternalDeps] !== undefined)
      .forEach((name) => {
        const item = internalDeps[name as keyof InternalDeps];
        subjectDeps[name as keyof Deps].next(item);
      });
  };

  const graphSearch = async (query: string, page = 0) => {
    const queryClient = (await defferedDependency(
      'queryClient'
    )) as CyberClient;

    const keywordHash = await getSearchQuery(query);

    return searchByHash(queryClient, keywordHash, page);
  };

  const getIpfsTextConent = async (cid: string) => {
    const ipfsApi = (await defferedDependency('ipfsApi')) as IpfsApi;
    return ipfsApi.fetchWithDetails(cid, 'text');
  };

  const evalScriptFromIpfs = async (
    cid: ParticleCid,
    funcName: string,
    params = {}
  ) => {
    try {
      const result = await getIpfsTextConent(cid);

      if (result?.content === undefined) {
        return { action: 'error', message: 'Particle not found' };
      }
      // in case of soul script is mixed with markdown
      // need to extract pure script
      const pureScript = extractRuneScript(result.content);
      const rune = (await defferedDependency('rune')) as RuneEngine;

      return rune.executeFunction(pureScript, funcName, params);
    } catch (e) {
      return { action: 'error', message: e.toString() };
    }
  };

  const executeScriptCallback = async (refId: string, data = {}) => {
    try {
      const rune = (await defferedDependency('rune')) as RuneEngine;
      return rune.executeCallback(refId, data);
    } catch (e) {
      return { action: 'error', message: e.toString() };
    }
  };

  const cybApi = {
    graphSearch,
    cyberlink: async (from: string, to: string) => {
      const address = subjectDeps.address.getValue();
      if (!address) {
        throw new Error('Connect your wallet first');
      }
      const senseApi = (await defferedDependency('senseApi')) as SenseApi;
      const signingClient = (await defferedDependency(
        'signingClient'
      )) as SigningCyberClient;

      return sendCyberlink(address, from, to, {
        senseApi,
        signingClient,
      });
    },
    getPassportByNickname: async (nickname: string) => {
      const queryClient = await defferedDependency('queryClient');
      const passport = await getPassportByNickname(queryClient, nickname);

      return passport;
    },
    searcByEmbedding: async (text: string, count = 10) => {
      const mlApi = (await defferedDependency('mlApi')) as MlApi;

      return mlApi.searchByEmbedding(text, count);
    },
    evalScriptFromIpfs,
    getIpfsTextConent,
    addContenToIpfs: async (content: string) => {
      const ipfsApi = (await defferedDependency('ipfsApi')) as IpfsApi;

      return ipfsApi.addContent(content);
    },
    executeScriptCallback,
  };

  return { setExternalDeps, setInternalDeps, cybApi };
};

const runeDeps = createRuneDeps();

export type RuneDeps = typeof runeDeps;

// export type EngineDeps = ReturnType<typeof createRuneDeps>;

export default runeDeps;
