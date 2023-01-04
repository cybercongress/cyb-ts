import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { initIpfs, setIpfsStatus, setIpfsID } from './redux/actions/ipfs';
import { setTypeDevice } from './redux/actions/settings';
import useIpfsStart from './ipfsHook';
import AppRouter from './router';
import useGetMarketData from './containers/nebula/useGetMarketData';
import { AppContext } from './context';

function App({
  initIpfsProps,
  setIpfsStatusProps,
  setTypeDeviceProps,
  setIpfsIDProps,
}) {
  const { updatetMarketData } = useContext(AppContext);
  const dataIpfsStart = useIpfsStart();
  const { marketData } = useGetMarketData();

  useEffect(() => {
    initIpfsProps(dataIpfsStart.node);
    setIpfsStatusProps(dataIpfsStart.status);
    setTypeDeviceProps(dataIpfsStart.mobile);
    setIpfsIDProps(dataIpfsStart.id);
    // tryConnectToPeer(dataIpfsStart.node);
  }, [dataIpfsStart]);

  useEffect(() => {
    if (Object.keys(marketData).length > 0) {
      updatetMarketData(marketData);
    }
  }, [marketData]);

  return <AppRouter />;
}

const mapDispatchprops = (dispatch) => {
  return {
    initIpfsProps: (ipfsNode) => dispatch(initIpfs(ipfsNode)),
    setIpfsStatusProps: (status) => dispatch(setIpfsStatus(status)),
    setTypeDeviceProps: (type) => dispatch(setTypeDevice(type)),
    setIpfsIDProps: (id) => dispatch(setIpfsID(id)),
  };
};

export default connect(null, mapDispatchprops)(App);
