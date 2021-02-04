import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, Pane, Dialog, Tablist } from '@cybercongress/gravity';
import { Link, Switch, Route, Router, useLocation } from 'react-router-dom';
import withWeb3 from '../../components/web3/withWeb3';
import Dinamics from './dinamics';
import Statistics from './statistics';
import Table from './table';
import ActionBarContainer from './ActionBarContainer';

import { Loading, LinkWindow, Copy, TabBtn } from '../../components';
import {
  COSMOS,
  TAKEOFF,
  TAKEOFF_SUPPLY,
  GENESIS_SUPPLY,
  CYBER,
} from '../../utils/config';
// import PopapAddress from './popap';
import Details from '../funding/details';
import Quotes from '../funding/quotes';

import { getGroupAddress, getDataPlot, chekPathname } from './utils';
import { useGetMarketData, useGetTx } from './hooks';

function PortPages({ mobile, accounts, web3, defaultAccount }) {
  const location = useLocation();
  const dataTxs = useGetTx();
  const marketData = useGetMarketData();
  const [selected, setSelected] = useState('manifest');
  const [dataTable, setDataTable] = useState({});
  const [dataProgress, setDataProgress] = useState([]);
  const [pin, setPin] = useState(null);

  useEffect(() => {
    const { account } = defaultAccount;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'eth')
    ) {
      setPin({ ...account.eth });
    } else {
      setPin(null);
    }
  }, [defaultAccount.name]);

  useEffect(() => {
    const { pathname } = location;
    const requere = chekPathname(pathname);
    setSelected(requere);
  }, [location.pathname]);

  useEffect(() => {
    if (!dataTxs.loading) {
      const groupsAddress = getGroupAddress(dataTxs.data);
      setDataTable(groupsAddress);
    }
  }, [dataTxs]);

  useEffect(() => {
    if (!marketData.loading) {
      let dataPlot = [];
      dataPlot = getDataPlot(marketData.eulsWon / CYBER.DIVISOR_CYBER_G);
      setDataProgress(dataPlot);
    }
  }, [marketData]);

  // onClickPopapAdress = () => {
  //   this.setState({
  //     popapAdress: false,
  //   });
  // };

  // onClickPopapAdressTrue = () => {
  //   this.setState({
  //     popapAdress: true,
  //   });
  // };

  let content;

  if (selected === 'progress') {
    content = (
      <Dinamics
        mobile={mobile}
        cap={marketData.marketCapEth}
        data3d={dataProgress}
        dataTxs={dataTxs}
      />
    );
  }

  if (selected === 'leaderboard') {
    content = <Table mobile={mobile} pin={pin} data={dataTable} />;
  }

  if (selected === 'manifest') {
    content = <Details />;
  }

  return (
    <span>
      {/* {popapAdress && (
          <PopapAddress
            address={COSMOS.ADDR_FUNDING}
            onClickPopapAdress={this.onClickPopapAdress}
          />
        )} */}

      <main className="block-body takeoff">
        <Quotes />
        {pin === null && (
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginTop={5}
            marginBottom={20}
          >
            <Text fontSize="16px" color="#fff">
              Takeoff is the key element during the{' '}
              <Link to="/gol">Game of Links</Link> on the path for deploying
              Superintelligence. Please, thoroughly study details before
              donating. But remember - the more you wait, the higher the price.
            </Text>
          </Pane>
        )}
        {pin !== null && (
          <Table
            styles={{ marginBottom: 20, marginTop: 0 }}
            data={dataTable}
            onlyPin
            pin={pin}
          />
        )}
        <Statistics marketData={marketData} />
        <Tablist className="tab-list" marginY={20}>
          <TabBtn
            text="Leaderboard"
            isSelected={selected === 'leaderboard'}
            to="/port/leaderboard"
          />
          <TabBtn
            text="Manifest"
            isSelected={selected === 'manifest'}
            to="/port"
          />
          <TabBtn
            text="Progress"
            isSelected={selected === 'progress'}
            to="/port/progress"
          />
        </Tablist>
        {content}
      </main>
      <ActionBarContainer accounts={accounts} web3={web3} />
    </span>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(withWeb3(PortPages));
