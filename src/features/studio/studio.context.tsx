import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useBackend } from 'src/contexts/backend/backend';
import { addIfpsMessageOrCid } from 'src/utils/ipfs/helpers';
import { useParams } from 'react-router-dom';
import useParticle from 'src/hooks/useParticle';
import useAdviserTexts from '../adviser/useAdviserTexts';

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
  loadedMarkdown: string;
  setStateActionBar: React.Dispatch<React.SetStateAction<StateActionBar>>;
  addKeywords: (type: 'from' | 'to', item: string) => void;
  removeKeywords: (type: 'from' | 'to', item: string) => void;
  onChangeCurrentMarkdown: React.Dispatch<React.SetStateAction<string>>;
}>({
  stateActionBar: 'link',
  currentMarkdown: '',
  loadedMarkdown: '',
  keywordsFrom: [],
  keywordsTo: [],
  setStateActionBar: () => {},
  addKeywords: () => {},
  removeKeywords: () => {},
  onChangeCurrentMarkdown: () => {},
});

export const useStudioContext = () => React.useContext(StudioContext);

function StudioContextProvider({ children }: { children: React.ReactNode }) {
  const { isIpfsInitialized, ipfsApi } = useBackend();
  const { cid } = useParams();
  const { status, details } = useParticle(cid!);
  const content =
    details && details.type === 'text' && details.content
      ? details.content
      : '';
  const [stateActionBar, setStateActionBar] = useState<StateActionBar>('link');
  const [keywordsFrom, setKeywordsFrom] = useState<KeywordsItem[]>([]);
  const [keywordsTo, setKeywordsTo] = useState<KeywordsItem[]>([]);
  const [currentMarkdown, setCurrentMarkdown] = useState<string>('');

  useAdviserTexts({
    isLoading: (!cid && status === 'pending') || !isIpfsInitialized,
    loadingText: !isIpfsInitialized ? 'node is loading' : 'cid is loading',
    defaultText: 'you can create content',
    error:
      details && details.type !== 'text'
        ? 'invalid content type, content must be text type'
        : undefined,
  });

  useEffect(() => {
    if (content.length && !currentMarkdown.length) {
      setCurrentMarkdown(content);
    }
  }, [content, currentMarkdown]);

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

  const removeKeywords = useCallback(
    (type: 'from' | 'to', itemCid: string) => {
      const stateKeywords = type === 'from' ? keywordsFrom : keywordsTo;
      const setStateKeywords =
        type === 'from' ? setKeywordsFrom : setKeywordsTo;
      const newState = stateKeywords.filter((item) => item.cid !== itemCid);
      setStateKeywords(newState);
    },
    [keywordsFrom, keywordsTo]
  );

  const contextValue = useMemo(
    () => ({
      currentMarkdown,
      loadedMarkdown: content,
      stateActionBar,
      keywordsFrom,
      keywordsTo,
      setStateActionBar,
      addKeywords,
      onChangeCurrentMarkdown: setCurrentMarkdown,
      removeKeywords,
    }),
    [
      stateActionBar,
      setStateActionBar,
      keywordsFrom,
      keywordsTo,
      addKeywords,
      currentMarkdown,
      content,
      setCurrentMarkdown,
      removeKeywords,
    ]
  );

  return (
    <StudioContext.Provider value={contextValue}>
      {children}
    </StudioContext.Provider>
  );
}

export default StudioContextProvider;
