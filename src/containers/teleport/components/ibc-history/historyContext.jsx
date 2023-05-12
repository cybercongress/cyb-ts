/* eslint-disable */
import React, { useContext, useState, useEffect } from 'react';
import dbIbcHistory from './db';

const valueContext = { history: {}, changeHistory: () => {} };

export const HistoryContext = React.createContext(valueContext);

const useNavigateContext = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('Error in creating the context');
  }
  return context;
};

function HistoryContextProvider({ children }) {
  const [value, setValue] = useState(valueContext);

  useEffect(() => {
    const fetchHistory = async () => {
      const dataIndexdDb = await dbIbcHistory.table('histories');
      console.log('dataIndexdDb', dataIndexdDb);
    };

    fetchHistory();
  }, []);

  const changeHistory = (history) => {
    console.log('history', history);
    // setValue((item) => ({ ...item, history: { ...item.history, history } }));
  };

  return (
    <HistoryContext.Provider value={{ ...value, changeHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export default HistoryContextProvider;
