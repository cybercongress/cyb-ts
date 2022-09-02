import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { coins } from '@cosmjs/launchpad';
import { fromAscii, fromBase64 } from '@cosmjs/encoding';
import { AppContext, AppContextSigner } from '../../context';
import { CYBER, CYBER_SIGNER } from '../../utils/config';
const uint8ArrayConcat = require('uint8arrays/concat');

// import Signer from '../signer';

const testData =
  'eyJ0eXBlVXJsIjoiL2Nvc21vcy5iYW5rLnYxYmV0YTEuTXNnU2VuZCIsInZhbHVlIjp7ImZyb21BZGRyZXNzIjoiYm9zdHJvbTFmcms5azM4cHZwNzB2aGVlemhkZmQ0bnZxbmxzbTlkdzNqOGhscSIsInRvQWRkcmVzcyI6ImJvc3Ryb20xZnJrOWszOHB2cDcwdmhlZXpoZGZkNG52cW5sc205ZHczajhobHEiLCJhbW91bnQiOlt7ImRlbm9tIjoiYm9vdCIsImFtb3VudCI6IjQyIn1dfX0=';

// dune pottery shield bracket shuffle orchard frown mail exercise destroy enroll nothing scheme allow pudding match mass world glow razor that attend blame follow


function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function TestKeplr() {
  const { keplr } = useContext(AppContext);
  const {
    cyberSigner,
    updateValueTxs,
    updateValueIsVisible,
    updateCallbackSigner,
    updateStageSigner,
  } = useContext(AppContextSigner);

  const [hashTx, setHashTx] = useState('');
  const [msgsData, setMsgsData] = useState([]);
  const search = useQuery();

  console.log('params', search);

  useEffect(() => {
    try {
      const msgs = [];
      const fromBase64Data = fromAscii(fromBase64(testData));
      msgs.push(JSON.parse(fromBase64Data));
      setMsgsData(msgs);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const sendTxSigner = useCallback(async () => {
    if (cyberSigner !== null) {
      console.log('msgsData', msgsData);
      updateValueTxs(msgsData);
    }
  }, [msgsData, cyberSigner]);

  return (
    <main className="block-body">
      <button
        className="btn"
        style={{ maxWidth: 200, marginTop: 50 }}
        onClick={sendTxSigner}
        type="button"
      >
        sendTxSigner
      </button>

      <span>{hashTx}</span>
    </main>
  );
}

export default TestKeplr;
