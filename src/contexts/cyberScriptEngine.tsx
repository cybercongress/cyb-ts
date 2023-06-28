import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useIpfs } from './ipfs';
import { useQueryClient } from 'src/contexts/queryClient';
import { useSigningClient } from './signerClient';
import {
  loadCyberScripingEngine,
  // isCyberScriptingLoaded,
  runScript,
} from 'src/services/scripting/engine';

import { appBus } from 'src/services/scripting/bus';

type DependecyState = {
  isCyberScriptingLoaded: boolean;
};

const getEmptyDependecyState = (): DependecyState => ({
  isCyberScriptingLoaded: false,
});

type CyberScriptsContextType = {
  depts: DependecyState;
  isLoaded: boolean;
  runScript: (code: string) => Promise<any>;
  onCallback?: (code: string) => void;
};

const CyberScriptsContext = React.createContext<CyberScriptsContextType>({
  depts: getEmptyDependecyState(),
  runScript: async () => {
    throw new Error('CyberScriptsProvider not loaded');
  },
  isLoaded: false,
});

export function useCyberScriptEngine() {
  const cyberScripts = useContext(CyberScriptsContext);
  return cyberScripts;
}

function CyberScriptEngineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // let params = useParams();
  // let location = useLocation();
  const queryClient = useQueryClient();
  const { signer, signingClient } = useSigningClient();

  const [dependecyState, setDependecyState] = useState<DependecyState>(
    getEmptyDependecyState()
  );
  const { node } = useIpfs();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const initScripting = async () => {
      await loadCyberScripingEngine();
      setDependecyState((prevState) => ({
        ...prevState,
        isCyberScriptingLoaded: true,
      }));
    };
    initScripting();
  }, []);

  useEffect(() => {
    if (node) {
      appBus.emit('init', { name: 'ipfs', item: node });
    }
  }, [node]);

  useEffect(() => {
    if (queryClient) {
      appBus.emit('init', { name: 'queryClient', item: queryClient });
    }
  }, [queryClient]);

  useEffect(() => {
    if (signingClient) {
      appBus.emit('init', { name: 'signer', item: { signer, signingClient } });
    }
  }, [signer, signingClient]);

  useEffect(() => {
    const { isCyberScriptingLoaded } = dependecyState;
    setIsLoaded(isCyberScriptingLoaded);
  }, [dependecyState]);

  const value = useMemo(
    () => ({ depts: dependecyState, runScript, isLoaded }),
    [dependecyState, isLoaded]
  );

  return (
    <CyberScriptsContext.Provider value={value}>
      {children}
    </CyberScriptsContext.Provider>
  );
}

export default CyberScriptEngineProvider;
