import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ScriptMyCampanion, UserContext } from 'src/services/scripting/types';
import { IPFSContentMutated, IpfsContentType } from 'src/services/ipfs/types';
import { useBackend } from '../backend/backend';
import { Remote, proxy } from 'comlink';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectRuneEntypoints,
  setEntrypoint,
} from 'src/redux/reducers/scripting';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import { RuneEngine } from 'src/services/scripting/engine';
import { Option } from 'src/types';

type RuneFrontend = Omit<RuneEngine, 'isSoulInitialized$'>;

type ScriptingContextType = {
  isSoulInitialized: boolean;
  rune: Option<Remote<RuneFrontend>>;
};

const ScriptingContext = React.createContext<ScriptingContextType>({
  isSoulInitialized: false,
  rune: undefined,
});

export function useScripting() {
  return React.useContext(ScriptingContext);
}

function ScriptingProvider({ children }: { children: React.ReactNode }) {
  const { rune: runeBackend, ipfsApi, isIpfsInitialized } = useBackend();

  const [isSoulInitialized, setIsSoulInitialized] = useState(false);
  const runeRef = useRef<Option<Remote<RuneFrontend>>>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const setupObservervable = async () => {
      const { isSoulInitialized$ } = runeBackend;

      const observer = await isSoulInitialized$;
      const subscription = observer.subscribe((v) => {
        setIsSoulInitialized(!!v);
        if (v) {
          runeRef.current = runeBackend;
          console.log('👻 soul initalized');
        }
      });

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
