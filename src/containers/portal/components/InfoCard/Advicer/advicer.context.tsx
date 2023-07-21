import React, { useMemo, useState } from 'react';

type ContextType = {
  setContent: (t: string) => void;
  content: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (t: boolean) => void;
};

const AdvicerContext = React.createContext<ContextType>({
  setContent: () => {},
  content: '',
  isOpen: false,
  setIsOpen: () => {},
});

export function useAdvicer() {
  const context = React.useContext(AdvicerContext);
  if (!context) {
    throw new Error('useAdvicer must be used within a AdvicerProvider');
  }
  return context;
}

function AdvicerProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContextType['content']>();
  const [isOpen, setIsOpen] = useState<ContextType['isOpen']>(false);

  return (
    <AdvicerContext.Provider
      value={useMemo(() => {
        return {
          setContent: (content) => {
            setContent(content);
            setIsOpen(true);
          },
          content,
          setIsOpen,
          isOpen,
        };
      }, [content, isOpen])}
    >
      {children}
    </AdvicerContext.Provider>
  );
}

export default AdvicerProvider;
