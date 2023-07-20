import React, { useContext, useEffect, useMemo, useState } from 'react';
import scriptEngine from 'src/services/scripting/engine';
import { useQueryClient } from 'src/contexts/queryClient';

import { useIpfs } from './ipfs';
import { useSigningClient } from './signerClient';

type CyberScriptsContextType = {
  isLoaded: boolean;
};

const CyberScriptsContext = React.createContext<CyberScriptsContextType>({
  isLoaded: false,
});

// export function useCyberScriptEngine() {
//   const cyberScripts = useContext(CyberScriptsContext);
//   return cyberScripts;
// }

function CyberScriptEngineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // let params = useParams();
  // let location = useLocation();
  const queryClient = useQueryClient();
  const { signer, signingClient } = useSigningClient();

  const { node } = useIpfs();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const initScripting = async () => {
      await scriptEngine.load();
      setIsLoaded(true);
    };
    initScripting();
  }, []);

  useEffect(() => {
    node && scriptEngine.setDeps({ ipfs: node });
  }, [node]);

  useEffect(() => {
    queryClient && scriptEngine.setDeps({ queryClient });
  }, [queryClient]);

  useEffect(() => {
    signingClient && scriptEngine.setDeps({ signer, signingClient });
  }, [signer, signingClient]);

  const value = useMemo(() => ({ isLoaded }), [isLoaded]);

  return (
    <CyberScriptsContext.Provider value={value}>
      {children}
    </CyberScriptsContext.Provider>
  );
}

export default CyberScriptEngineProvider;
