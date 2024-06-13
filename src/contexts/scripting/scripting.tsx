import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserContext } from 'src/services/scripting/types';
import { Remote, proxy } from 'comlink';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectRuneEntypoints,
  setEntrypoint,
} from 'src/redux/reducers/scripting';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import { RuneEngine } from 'src/services/scripting/engine';
import { Option } from 'src/types';
import { EmbeddingApi } from 'src/services/backend/workers/background/api/mlApi';
import { useBackend } from '../backend/backend';

type RuneFrontend = Omit<RuneEngine, 'isSoulInitialized$'>;

type ScriptingContextType = {
  isSoulInitialized: boolean;
  rune: Option<Remote<RuneFrontend>>;
  embeddingApi: Option<EmbeddingApi>;
};

const ScriptingContext = React.createContext<ScriptingContextType>({
  isSoulInitialized: false,
  rune: undefined,
  embeddingApi: undefined,
});

export function useScripting() {
  return React.useContext(ScriptingContext);
}

function ScriptingProvider({ children }: { children: React.ReactNode }) {
  const {
    rune: runeBackend,
    ipfsApi,
    isIpfsInitialized,
    embeddingApi$,
  } = useBackend();

  const [isSoulInitialized, setIsSoulInitialized] = useState(false);
  const runeRef = useRef<Option<Remote<RuneFrontend>>>();
  const embeddingApiRef = useRef<Option<Remote<EmbeddingApi>>>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const setupObservervable = async () => {
      const { isSoulInitialized$ } = runeBackend;

      const soulSubscription = (await isSoulInitialized$).subscribe((v) => {
        setIsSoulInitialized(!!v);
        if (v) {
          runeRef.current = runeBackend;
          console.log('👻 soul initalized');
        }
      });

      const embeddingApiSubscription = (await embeddingApi$).subscribe(
        proxy((embeddingApi) => {
          if (embeddingApi) {
            embeddingApiRef.current = embeddingApi;
            console.log('+ embedding api initalized', embeddingApi);
          }
        })
      );

      return () => {
        soulSubscription.unsubscribe();
        embeddingApiSubscription.unsubscribe();
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

        await runeBackend.pushContext('user', {
          address: citizenship.owner,
          nickname: citizenship.extension.nickname,
          citizenship,
          particle: particleCid,
        } as UserContext);
      } else {
        await runeBackend.popContext(['user', 'secrets']);
      }
    })();
  }, [citizenship, runeBackend]);

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
    runeBackend.setEntrypoints(runeEntryPoints);
  }, [runeEntryPoints, runeBackend]);

  const value = useMemo(() => {
    return {
      rune: runeRef.current,
      embeddingApi: embeddingApiRef.current,
      isSoulInitialized,
    };
  }, [isSoulInitialized]);

  return (
    <ScriptingContext.Provider value={value}>
      {children}
    </ScriptingContext.Provider>
  );
}

export default ScriptingProvider;
