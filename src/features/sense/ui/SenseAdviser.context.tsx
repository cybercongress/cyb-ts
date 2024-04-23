import React, { useMemo } from 'react';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  setAdviser: (text: string, color: string) => void;
};

const AdviserContext = React.createContext<ContextType>({
  setAdviser: (text: string, color: string) => {},
});

function SenseAdviserProvider({ children }: Props) {
  const [content, setContent] = useState();
  const [first, setfirst] = useState(second);

  const value = useMemo(() => {}, []);
  return (
    <AdviserContext.Provider value={value}>{children}</AdviserContext.Provider>
  );
}

export default SenseAdviserProvider;
