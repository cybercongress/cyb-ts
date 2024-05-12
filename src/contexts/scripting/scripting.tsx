import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useBackend } from '../backend/backend';
import { ScriptMyCampanion } from 'src/services/scripting/types';
import { IpfsContentType } from 'src/services/ipfs/types';

export type ScriptingContextType = {
  status: 'loading' | 'ready' | 'pending' | 'done' | 'error';
  metaItems: ScriptMyCampanion['metaItems'];
  runScript: (
    cid: string,
    contentType: IpfsContentType,
    content: any
  ) => Promise<void>;
};

const ScriptingContext = React.createContext<ScriptingContextType>({
  status: 'loading',
  metaItems: [],
  runScript: async () => {
    throw new Error('ScriptingProvider not found');
  },
});

export function useScripting() {
  return React.useContext(ScriptingContext);
}

function ScriptingProvider({ children }: { children: React.ReactNode }) {
  const { rune } = useBackend();
  const [status, setStatus] =
    useState<ScriptingContextType['status']>('loading');
  const [metaItems, setMetaItems] = useState<ScriptingContextType['metaItems']>(
    []
  );
  const runScript = useCallback(
    async (cid: string, contentType: IpfsContentType, content: any) => {
      if (contentType !== 'text') {
        setStatus('done');
        setMetaItems([
          { type: 'text', text: `Skip companion for '${contentType}'.` },
        ]);
        return;
      }
      await rune?.askCompanion(cid, contentType, content).then((result) => {
        setMetaItems(result.metaItems);
        setStatus('done');
      });
    },
    [rune]
  );

  const value = useMemo(() => {
    return {
      status,
      metaItems,
      runScript,
    };
  }, [status, metaItems, runScript]);

  return (
    <ScriptingContext.Provider value={value}>
      {children}
    </ScriptingContext.Provider>
  );
}

export default ScriptingProvider;
