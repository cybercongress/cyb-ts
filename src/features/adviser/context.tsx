import React, { useCallback, useMemo, useState } from 'react';
import { Props as AdviserProps } from './Adviser/Adviser';

type ContextType = {
  setAdviser: (
    content: AdviserProps['children'],
    color?: AdviserProps['color']
  ) => void;
  setAdviserNew: (
    id: string,
    content: AdviserProps['children'],
    color?: AdviserProps['color']
  ) => void;
  content: AdviserProps['children'];
  color?: AdviserProps['color'];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const AdviserContext = React.createContext<ContextType>({
  content: '',

  /*
   * @deprecated use setAdviser2
   */
  setAdviser: () => {},
  setAdviserNew: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export function useAdviser() {
  const context = React.useContext(AdviserContext);
  if (!context) {
    throw new Error('useAdviser must be used within a AdviserProvider');
  }
  return context;
}

type StateItem = {
  id: string;
  content: AdviserProps['children'];
  color?: AdviserProps['color'];
};

type State = StateItem[];

const NO_ID = 'NO_ID';

function AdviserProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<ContextType['isOpen']>(false);

  const [state, setState] = useState<State>([]);

  const handleSetAdviser = useCallback((id: string, content, color) => {
    setState((prev) => {
      const newState = prev.filter((item) => item.id !== id);

      const n = [...newState];

      if (content) {
        n.push({
          id,
          content,
          color,
        });
      }

      return n;
    });

    setIsOpen(true);
  }, []);

  const handleSetAdviserLegacy = useCallback(
    (content, color) => {
      handleSetAdviser(NO_ID, content, color);
    },
    [handleSetAdviser]
  );

  const lastItem = state[state.length - 1];

  console.log(state);

  const { content, color } = lastItem || {};

  const value = useMemo(() => {
    return {
      setAdviser: handleSetAdviserLegacy,
      // need some refactor
      setAdviserNew: handleSetAdviser,
      content,
      color,
      setIsOpen,
      isOpen,
    };
  }, [content, color, isOpen, handleSetAdviser, handleSetAdviserLegacy]);

  return (
    <AdviserContext.Provider value={value}>{children}</AdviserContext.Provider>
  );
}

export default AdviserProvider;
