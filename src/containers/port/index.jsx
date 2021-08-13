import React, { useEffect, useState, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { Text, Pane, Tablist } from '@cybercongress/gravity';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';

import withWeb3 from '../../components/web3/withWeb3';
import Statistics from './statistics';
import Table from './table';
import ActionBarContainer from './ActionBarContainer';

import { TabBtn } from '../../components';
import { CYBER } from '../../utils/config';
import Manifest from './manifest';
import Cyber from './cyber';
import Corp from './corp';

import { getGroupAddress, getDataPlot, chekPathname } from './utils';
import { useGetMarketData, useGetTx } from './hooks';

const Dinamics = lazy(() => import('./dinamics'));

function PortPages({ mobile, web3, accounts, defaultAccount }) {
  const location = useLocation();
  const match = useRouteMatch();
  const dataTxs = useGetTx();
  const marketData = useGetMarketData();
  const [selected, setSelected] = useState('manifest');
  const [dataTable, setDataTable] = useState({});
  const [dataProgress, setDataProgress] = useState([]);
  const [dataPin, setDataPin] = useState({});
  const [accountsETH, setAccountsETH] = useState(null);
  const [visa, setVisa] = useState({
    citizen: {
      eth: 0.1,
      gcyb: 0,
    },
    pro: {
      eth: 1,
      gcyb: 0,
    },
    hero: {
      eth: 10,
      gcyb: 0,
    },
  });
  const [pocketAddress, setPocketAddress] = useState({
    eth: {
      bech32: null,
    },
    cyber: {
      bech32: null,
    },
  });

  useEffect(() => {
    if (accounts != null) {
      setAccountsETH(accounts);
    }
  }, []);

  useEffect(() => {
    if (web3 != null && web3.givenProvider !== null) {
      window.ethereum.on('accountsChanged', (accountsChanged) => {
        const defaultAccounts = accountsChanged[0];
        setAccountsETH(defaultAccounts);
      });
    }
  }, [web3]);

  useEffect(() => {
    const { account } = defaultAccount;
    console.log('account', account);
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'eth')
    ) {
      setPocketAddress((item) => ({
        ...item,
        eth: {
          ...account.eth,
        },
      }));
    } else {
      setPocketAddress((item) => ({
        ...item,
        eth: {
          bech32: null,
        },
      }));
    }
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      setPocketAddress((item) => ({
        ...item,
        cyber: {
          ...account.cyber,
        },
      }));
    } else {
      setPocketAddress((item) => ({
        ...item,
        cyber: {
          bech32: null,
        },
      }));
    }
  }, [defaultAccount]);

  useEffect(() => {
    const { pathname } = location;
    const requere = chekPathname(pathname);
    setSelected(requere);
  }, [location.pathname]);

  useEffect(() => {
    setDataPin({});
    if (pocketAddress.eth.bech32 !== null) {
      if (
        Object.prototype.hasOwnProperty.call(
          dataTable,
          pocketAddress.eth.bech32
        )
      ) {
        setDataPin({
          [pocketAddress.eth.bech32]: {
            ...dataTable[pocketAddress.eth.bech32],
          },
        });
      } else {
        setDataPin({});
      }
    } else {
      setDataPin({});
    }
  }, [dataTable, pocketAddress]);

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

  useEffect(() => {
    if (!marketData.loading) {
      const sumGeul = marketData.eulsWon / CYBER.DIVISOR_CYBER_G;
      Object.keys(visa).forEach((key) => {
        const tempConst =
          0.000099 * sumGeul ** 2 + 0.1 * sumGeul + visa[key].eth;
        const x0Eul =
          (1000 / 99) *
          ((99 * tempConst + 2500) ** (1 / 2) - 50) *
          CYBER.DIVISOR_CYBER_G;
        const gcyb = (x0Eul - marketData.eulsWon) / CYBER.DIVISOR_CYBER_G;
        setVisa((item) => ({
          ...item,
          [key]: {
            ...visa[key],
            gcyb,
          },
        }));
      });
    }
  }, [marketData]);

  let content;

  if (selected === 'progress') {
    content = (
      <>
        <Statistics marketData={marketData} />
        <Suspense fallback={<div>Loading... </div>}>
          <Dinamics
            mobile={mobile}
            cap={marketData.marketCapEth}
            data3d={dataProgress}
            dataTxs={dataTxs}
          />
        </Suspense>
      </>
    );
  }

  if (selected === 'leaderboard') {
    content = (
      <Table mobile={mobile} pin={pocketAddress.eth.bech32} data={dataTable} />
    );
  }

  if (selected === 'corp') {
    content = <Cyber mobile={mobile} />;
  }

  if (selected === 'manifest') {
    content = <Manifest />;
  }

  if (selected === 'gov') {
    content = <Corp mobile={mobile} />;
  }

  return (
    <>
      <main className="block-body takeoff">
        {Object.keys(dataPin).length === 0 && (
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginTop={5}
            marginBottom={20}
            borderRadius="5px"
          >
            <Text fontSize="16px" color="#fff">
              Welcome to the Port! You can get Citizenship right now. Read some
              philosophy in the{' '}
              <Link to="/ipfs/QmNYzWnBRVkT7QCGLvQqqCDJNaGXsR3Nzddj2MMS982kRf">
                post
              </Link>
            </Text>
          </Pane>
        )}
        {Object.keys(dataPin).length > 0 && (
          <Table styles={{ marginBottom: 20, marginTop: 0 }} data={dataPin} />
        )}
        <Tablist className="tab-list" marginY={20}>
          <TabBtn
            text="Leaderboard"
            isSelected={selected === 'leaderboard'}
            to={`${match.url}/leaderboard`}
          />
          <TabBtn
            text="Cyber vs Corp"
            isSelected={selected === 'corp'}
            to={`${match.url}/cyber-vs-corp`}
          />
          <TabBtn
            text="Manifesto"
            isSelected={selected === 'manifest'}
            to={match.url}
          />
          <TabBtn
            text="Cyber vs Gov"
            isSelected={selected === 'gov'}
            to={`${match.url}/cyber-vs-gov`}
          />
          <TabBtn
            text="Progress"
            isSelected={selected === 'progress'}
            to={`${match.url}/progress`}
          />
        </Tablist>
        {content}
      </main>
      {/* <ActionBarContainer
        visa={visa}
        accountsETH={accountsETH}
        pocketAddress={pocketAddress}
        web3={web3}
      /> */}
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(withWeb3(PortPages));
