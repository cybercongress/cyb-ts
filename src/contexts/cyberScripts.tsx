import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useIpfs } from './ipfs';
import { useQueryClient } from 'src/contexts/queryClient';
import {
  loadCyberScripingEngine,
  // isCyberScriptingLoaded,
  setCyberClient,
  setIpfs,
  runScript,
} from 'src/services/scripting/engine';

type DependecyState = {
  isCyberScriptingLoaded: boolean;
  isIpfNodeReady: boolean;
  isQueryClientReady: boolean;
};

const getEmptyDependecyState = (): DependecyState => ({
  isCyberScriptingLoaded: false,
  isIpfNodeReady: false,
  isQueryClientReady: false,
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

export function useCyberScripts() {
  const cyberScripts = useContext(CyberScriptsContext);
  return cyberScripts;
}

function CyberScriptsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
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
      setIpfs(node);
      setDependecyState((prevState) => ({
        ...prevState,
        isIpfNodeReady: true,
      }));
    }
  }, [node]);

  useEffect(() => {
    if (queryClient) {
      setCyberClient(queryClient);
      setDependecyState((prevState) => ({
        ...prevState,
        isQueryClientReady: true,
      }));
    }
  }, [queryClient]);

  useEffect(() => {
    const { isCyberScriptingLoaded, isIpfNodeReady, isQueryClientReady } =
      dependecyState;
    setIsLoaded(isCyberScriptingLoaded && isIpfNodeReady && isQueryClientReady);
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

export default CyberScriptsProvider;
