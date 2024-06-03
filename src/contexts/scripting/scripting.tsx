import React, { useCallback, useMemo, useState } from 'react';
import { ScriptMyCampanion } from 'src/services/scripting/types';
import { IPFSContentMutated, IpfsContentType } from 'src/services/ipfs/types';
import { useBackend } from '../backend/backend';
import { proxy } from 'comlink';

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
  const { rune } = useBackend();
  const [status, setStatus] =
    useState<ScriptingContextType['status']>('loading');
  const [metaItems, setMetaItems] = useState<ScriptingContextType['metaItems']>(
    []
  );
  const askCompanion = useCallback(
    async (
      cid: string,
      contentType?: IpfsContentType,
      content?: IPFSContentMutated['result']
    ) => {
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
    [rune]
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
