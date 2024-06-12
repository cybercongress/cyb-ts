import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScriptMyCampanion, UserContext } from 'src/services/scripting/types';
import { IPFSContentMutated, IpfsContentType } from 'src/services/ipfs/types';
import { useBackend } from '../backend/backend';
import { proxy } from 'comlink';
import { useAppSelector } from 'src/redux/hooks';
import {
  selectRuneEntypoints,
  setEntrypoint,
} from 'src/redux/reducers/scripting';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import { useDispatch } from 'react-redux';

export type ScriptingContextType = {
  status: 'loading' | 'ready' | 'pending' | 'done' | 'error';
  metaItems: ScriptMyCampanion['metaItems'];
  askCompanion: (
    cid: string,
    contentType?: IpfsContentType,
    content?: IPFSContentMutated['result']
  ) => Promise<void>;
  clearMetaItems: () => void;
};

const ScriptingContext = React.createContext<ScriptingContextType>({
  status: 'loading',
  metaItems: [],
  askCompanion: async () => {
    throw new Error('ScriptingProvider not found');
  },
  clearMetaItems: () => null,
});

export function useScripting() {
  return React.useContext(ScriptingContext);
}

function ScriptingProvider({ children }: { children: React.ReactNode }) {
  const { rune, ipfsApi, isIpfsInitialized } = useBackend();
  const [isSoulInitialized, setIsSoulInitialized] = useState(false);
  const [status, setStatus] =
    useState<ScriptingContextType['status']>('loading');
  const [metaItems, setMetaItems] = useState<ScriptingContextType['metaItems']>(
    []
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // Get the observable from the worker
    // Subscribe to the observable
    const setupObservervable = async () => {
      const observer = await rune.isSoulInitialized$;
      const subscription = observer.subscribe((v) => {
        console.log('====SOUL INIT', v);
        setIsSoulInitialized(!!v);
      });

      // Return the cleanup function
      return () => {
        subscription.unsubscribe();
      };
    };

    setupObservervable();
  }, []);

  const runeEntryPoints = useAppSelector(selectRuneEntypoints);

  const citizenship = useAppSelector(selectCurrentPassport);

  useEffect(() => {
    (async () => {
      if (citizenship) {
        const particleCid = citizenship.extension.particle;

        await rune.pushContext('user', {
          address: citizenship.owner,
          nickname: citizenship.extension.nickname,
          citizenship,
          particle: particleCid,
        } as UserContext);
      } else {
        await rune.popContext(['user', 'secrets']);
      }
    })();
  }, [citizenship, rune]);

  useEffect(() => {
    (async () => {
      if (citizenship && ipfsApi) {
        const particleCid = citizenship.extension.particle;

        if (particleCid && isIpfsInitialized) {
          (async () => {
            const result = await ipfsApi.fetchWithDetails(particleCid, 'text');

            dispatch(
              setEntrypoint({ name: 'particle', code: result?.content || '' })
            );
          })();
        }
      }
    })();
  }, [citizenship, isIpfsInitialized, ipfsApi, dispatch]);

  useEffect(() => {
    rune.setEntrypoints(runeEntryPoints);
  }, [runeEntryPoints, rune]);

  const askCompanion = useCallback(
    async (
      cid: string,
      contentType?: IpfsContentType,
      content?: IPFSContentMutated['result']
    ) => {
      if (!isSoulInitialized) {
        return;
      }
      if (!contentType || !content || contentType !== 'text') {
        setStatus('done');
        setMetaItems([
          { type: 'text', text: `Skip companion for '${contentType}'.` },
        ]);
        return;
      }
      await rune
        ?.askCompanion(
          cid,
          contentType,
          content as string,
          proxy((data = {}) => console.log('CALLBACK'))
        )
        .then((result) => {
          setMetaItems(result.metaItems);
          setStatus('done');
        });
    },
    [isSoulInitialized, rune]
  );

  const clearMetaItems = useCallback(() => setMetaItems([]), [setMetaItems]);

  const value = useMemo(() => {
    return {
      status,
      metaItems,
      askCompanion,
      clearMetaItems,
    };
  }, [status, metaItems, askCompanion, clearMetaItems]);

  return (
    <ScriptingContext.Provider value={value}>
      {children}
    </ScriptingContext.Provider>
  );
}

export default ScriptingProvider;
