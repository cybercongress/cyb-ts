import React, { useContext, useEffect, useMemo, useState } from 'react';
import scriptEngine from 'src/services/scripting/engine';
import { useQueryClient } from 'src/contexts/queryClient';

import { useIpfs } from './ipfs';
import { useSigningClient } from './signerClient';
import { useDispatch, useSelector } from 'react-redux';
import { setScriptingEngineLoaded } from 'src/redux/features/scripting';
import { RootState } from 'src/redux/store';

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
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { signer, signingClient } = useSigningClient();

  const { node } = useIpfs();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const {
    scripts: { entrypoints },
    context: { secrets },
  } = useSelector((store: RootState) => store.scripting);

  useEffect(() => {
    const initScripting = async () => {
      await scriptEngine.load({ entrypoints, secrets });
      setIsLoaded(true);
      dispatch(setScriptingEngineLoaded(true));
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
