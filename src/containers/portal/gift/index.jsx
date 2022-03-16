import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { AppContext } from '../../../context';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import { useGetActivePassport } from '../utils';
import PasportCitizenship from '../pasport';
import ActionBarPortalGift from './ActionBarPortalGift';

function PortalGift({ defaultAccount }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [updateFunc, setUpdateFunc] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const { citizenship } = useGetActivePassport(addressActive, updateFunc);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null && txHash.status === 'pending') {
        const response = await jsCyber.getTx(txHash.txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setTxHash((item) => ({
              ...item,
              status: 'confirmed',
            }));
            setUpdateFunc((item) => item + 1);
            return;
          }
          if (response.code) {
            setTxHash((item) => ({
              ...item,
              status: 'error',
            }));
            // setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  console.log('citizenship', citizenship);

  let content;

  if (citizenship !== null) {
    content = (
      <>
        <PasportCitizenship txHash={txHash} citizenship={citizenship} />
        <ActionBarPortalGift
          // updateFunc={() => setUpdateFunc((item) => item + 1)}
          citizenship={citizenship}
          updateTxHash={updateTxHash}
        />
      </>
    );
  }

  return <>{content}</>;
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(PortalGift);
