import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AdviserColors } from './Adviser/Adviser';

type ContextType = {
  setAdviser: (
    content: React.ReactNode | string,
    color?: AdviserColors
  ) => void;
  content: React.ReactNode;
  isOpen: boolean;
  color?: AdviserColors;
  setIsOpen: (isOpen: boolean) => void;
};

const AdviserContext = React.createContext<ContextType>({
  content: '',
  setAdviser: () => {},
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

function AdviserProvider({ children }: { children: React.ReactNode }) {
  const [adviserProps, setAdviserProps] = useState<{
    content: ContextType['content'];
    color?: AdviserColors;
  }>({
    content: '',
  });
  const [isOpen, setIsOpen] = useState<ContextType['isOpen']>(false);

  const handleSetAdviser = useCallback((content, color) => {
    setAdviserProps({
      content,
      color,
    });
    setIsOpen(true);
  }, []);

  const { content, color } = adviserProps;

  const value = useMemo(() => {
    return {
      setAdviser: handleSetAdviser,
      content,
      color,
      setIsOpen,
      isOpen,
    };
  }, [content, color, isOpen, handleSetAdviser]);

  return (
    <AdviserContext.Provider value={value}>{children}</AdviserContext.Provider>
  );
}

export default AdviserProvider;
