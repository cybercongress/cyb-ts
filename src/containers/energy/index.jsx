import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { MyEnergy, Income, Outcome } from './tab';
import { Statistics, ActionBar } from './component';
import useGetSlots from '../mint/useGetSlots';
import useGetSourceRoutes from './hooks/useSourceRouted';
import { convertResources } from '../../utils/utils';

function RoutedEnergy({ defaultAccount }) {
  const location = useLocation();
  const [addressActive, setAddressActive] = useState(null);
  const [updateAddressFunc, setUpdateAddressFunc] = useState(0);
  const [selected, setSelected] = useState('myEnegy');
  const [selectedRoute, setSelectedRoute] = useState({});
  const [selectedIndex, setSelectedIndex] = useState('');
  const { slotsData, loadingAuthAccounts, balacesResource } = useGetSlots(
    addressActive,
    updateAddressFunc
  );
  const {
    sourceRouted,
    sourceEnergy,
    destinationRoutes,
    destinationEnergy,
  } = useGetSourceRoutes(addressActive, updateAddressFunc);

  useEffect(() => {
    setSelectedRoute({});
    setSelectedIndex('');
  }, [updateAddressFunc]);

  useEffect(() => {
    const { account } = defaultAccount;
    let addressPocket = null;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32 } = account.cyber;
      if (keys === 'keplr') {
        addressPocket = bech32;
      }
    }
    setAddressActive(addressPocket);
  }, [defaultAccount.name]);

  useEffect(() => {
    const { pathname } = location;
    if (pathname.match(/income/gm) && pathname.match(/income/gm).length > 0) {
      setSelected('income');
    } else if (
      pathname.match(/outcome/gm) &&
      pathname.match(/outcome/gm).length > 0
    ) {
      setSelected('outcome');
    } else {
      setSelected('myEnegy');
    }
  }, [location.pathname]);

  const selectRouteFunc = (route, index) => {
    let selectRoute = {};

    if (selectedIndex === index) {
      setSelectedIndex('');
    } else {
      setSelectedIndex(index);
    }
    if (selectedRoute !== route) {
      selectRoute = route;
    }
    setSelectedRoute(selectRoute);
  };

  let content;

  if (selected === 'myEnegy') {
    content = (
      <MyEnergy
        slotsData={slotsData}
        balacesResource={balacesResource}
        loadingAuthAccounts={loadingAuthAccounts}
      />
    );
  }

  if (selected === 'income') {
    content = <Income destinationRoutes={destinationRoutes} />;
  }

  if (selected === 'outcome') {
    content = (
      <Outcome
        selected={selectedIndex}
        sourceRouted={sourceRouted}
        selectRouteFunc={selectRouteFunc}
      />
    );
  }

  return (
    <>
      <main className="block-body">
        <Statistics
          active={selected}
          myEnegy={balacesResource.mamper * balacesResource.mvolt}
          outcome={
            convertResources(sourceEnergy.mamper) *
            convertResources(sourceEnergy.mvolt)
          }
          income={
            convertResources(destinationEnergy.mamper) *
            convertResources(destinationEnergy.mvolt)
          }
        />
        {content}
      </main>
      <ActionBar
        selected={selected}
        addressActive={addressActive}
        selectedRoute={selectedRoute}
        updateFnc={() => setUpdateAddressFunc((item) => item + 1)}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(RoutedEnergy);
