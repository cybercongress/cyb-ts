import React, { useCallback, useMemo, useState } from 'react';
import { useBackend } from 'src/contexts/backend/backend';
import { addIfpsMessageOrCid } from 'src/utils/ipfs/helpers';
import { markdown } from './testData';

type StateActionBar = 'link' | 'keywords-from' | 'keywords-to';

export type KeywordsItem = {
  text: string;
  cid: string;
};

const StudioContext = React.createContext<{
  stateActionBar: StateActionBar;
  keywordsFrom: KeywordsItem[];
  keywordsTo: KeywordsItem[];
  currentMarkdown: string;
  setStateActionBar: React.Dispatch<React.SetStateAction<StateActionBar>>;
  addKeywords: (type: 'from' | 'to', item: string) => void;
  onChangeCurrentMarkdown: React.Dispatch<React.SetStateAction<string>>;
}>({
  stateActionBar: 'link',
  currentMarkdown: '',
  keywordsFrom: [],
  keywordsTo: [],
  setStateActionBar: () => {},
  addKeywords: () => {},
  onChangeCurrentMarkdown: () => {},
});

export const useStudioContext = () => React.useContext(StudioContext);

function StudioContextProvider({ children }: { children: React.ReactNode }) {
  const { isIpfsInitialized, ipfsApi } = useBackend();
  const [stateActionBar, setStateActionBar] = useState<StateActionBar>('link');
  const [keywordsFrom, setKeywordsFrom] = useState<KeywordsItem[]>([]);
  const [keywordsTo, setKeywordsTo] = useState<KeywordsItem[]>([]);
  const [currentMarkdown, setCurrentMarkdown] = useState<string>(markdown);

  const addKeywords = useCallback(
    (type: 'from' | 'to', newItem: string) => {
      if (!isIpfsInitialized) {
        return;
      }

      const stateKeywords = type === 'from' ? keywordsFrom : keywordsTo;
      const setStateKeywords =
        type === 'from' ? setKeywordsFrom : setKeywordsTo;

      const set = new Set(stateKeywords.map((item) => item.text));

      if (!set.has(newItem)) {
        addIfpsMessageOrCid(newItem, { ipfsApi }).then((cid) => {
          setStateKeywords((item) => [...item, { text: newItem, cid }]);
        });
      }
    },
    [keywordsFrom, keywordsTo, ipfsApi, isIpfsInitialized]
  );

  const contextValue = useMemo(
    () => ({
      currentMarkdown,
      stateActionBar,
      keywordsFrom,
      keywordsTo,
      setStateActionBar,
      addKeywords,
      onChangeCurrentMarkdown: setCurrentMarkdown,
    }),
    [
      stateActionBar,
      setStateActionBar,
      keywordsFrom,
      keywordsTo,
      addKeywords,
      currentMarkdown,
      setCurrentMarkdown,
    ]
  );

  return (
    <StudioContext.Provider value={contextValue}>
      {children}
    </StudioContext.Provider>
  );
}

export default StudioContextProvider;
