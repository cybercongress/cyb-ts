import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Text, Pane, Dialog, Tablist } from '@cybercongress/gravity';
import { Link, Switch, Route, Router, useLocation } from 'react-router-dom';
import withWeb3 from '../../components/web3/withWeb3';
import Dinamics from './dinamics';
import Statistics from './statistics';
import Table from './table';
import ActionBarContainer from './ActionBarContainer';
import ActionBarTakeOff from '../funding/actionBar';
import {
  asyncForEach,
  formatNumber,
  trimString,
  getTimeRemaining,
} from '../../utils/utils';
import { Loading, LinkWindow, Copy, TabBtn } from '../../components';
import {
  COSMOS,
  TAKEOFF,
  TAKEOFF_SUPPLY,
  GENESIS_SUPPLY,
  CYBER,
} from '../../utils/config';
import {
  cybWon,
  funcDiscount,
  getEstimation,
  // getDataPlot,
  getRewards,
  //   getGroupAddress,
  funcDiscountRevers,
} from '../../utils/fundingMath';
import { getGraphQLQuery } from '../../utils/search/utils';
// import PopapAddress from './popap';
import Details from '../funding/details';
import Quotes from '../funding/quotes';

import { getGroupAddress, getDataPlot } from './utils';
import testTx from './test';

const URL_GRAPHQL = 'https://uranus.cybernode.ai/graphql/v1/graphql';

const QueryGetTx = `
query MyQuery {
  transaction {
    cyber_hash
    eul
    eth
    cyber
    block
    eth_txhash
    index
    sender
  }
}`;

const MarketData = `
query MarketData {
  market_data {
    current_price
    eth_donated
    euls_won
    last_price
    market_cap_eth
  }
}`;

const useGetTx = () => {
  const [txsData, setTxsData] = useState({ data: [], loading: true });

  useEffect(() => {
    const feachData = async () => {
      const resultData = await getGraphQLQuery(QueryGetTx, URL_GRAPHQL);
      if (resultData !== null && resultData.transaction) {
        setTxsData({ data: resultData.transaction, loading: false });
      } else {
        setTxsData({ data: [], loading: false });
      }
    };
    feachData();

    return () => {
      setTxsData({ data: [], loading: true });
    };
  }, []);

  return txsData;
};

const useGetMarketData = () => {
  const [marketData, setMarketData] = useState({
    currentPrice: 0,
    ethDonated: 0,
    eulsWon: 0,
    lastPrice: 0,
    marketCapEth: 0,
    loading: true,
  });

  useEffect(() => {
    const feachData = async () => {
      const resultData = await getGraphQLQuery(MarketData, URL_GRAPHQL);
      if (resultData !== null && resultData.market_data) {
        const market = resultData.market_data[0];
        setMarketData({
          currentPrice: market.current_price,
          ethDonated: market.eth_donated,
          eulsWon: market.euls_won,
          lastPrice: market.last_price,
          marketCapEth: market.market_cap_eth,
          loading: false,
        });
      } else {
        setMarketData((items) => ({
          ...items,
          loading: false,
        }));
      }
    };
    feachData();

    return () => {
      setMarketData({
        currentPrice: 0,
        ethDonated: 0,
        eulsWon: 0,
        lastPrice: 0,
        marketCapEth: 0,
        loading: true,
      });
    };
  }, []);

  return marketData;
};

const chekPathname = (pathname) => {
  if (pathname.match(/progress/gm) && pathname.match(/progress/gm).length > 0) {
    return 'progress';
  }
  if (
    pathname.match(/leaderboard/gm) &&
    pathname.match(/leaderboard/gm).length > 0
  ) {
    return 'leaderboard';
  }
  return 'manifest';
};

function PortPages({ mobile, accounts, web3 }) {
  const location = useLocation();
  const dataTxs = useGetTx();
  const marketData = useGetMarketData();
  const [selected, setSelected] = useState('manifest');
  const [dataTable, setDataTable] = useState({});
  const [dataProgress, setDataProgress] = useState([]);

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
    return () => {
      setDataTable({});
    };
  }, [dataTxs]);

  useEffect(() => {
    if (!marketData.loading) {
      let dataPlot = [];
      dataPlot = getDataPlot(marketData.eulsWon / CYBER.DIVISOR_CYBER_G);
      setDataProgress(dataPlot);
    }
    return () => {
      setDataTable([]);
    };
  }, [marketData]);

  // async componentDidMount() {
  //   // const encoded = Buffer.from(
  //   //   'cyber1hmkqhy8ygl6tnl5g8tc503rwrmmrkjcq4878e0'
  //   // ).toString('hex');
  //   // const decoded = Buffer.from(encoded, 'hex').toString();
  //   // console.log('encoded', `0x${encoded}`);
  //   // console.log('decoded', decoded);

  //   this.tableData();
  // }

  // const initClock = () => {
  //   try {
  //     const deadline = `${COSMOS.TIME_END}`;
  //     const startTime = Date.parse(deadline) - Date.parse(new Date());
  //     if (startTime <= 0) {
  //       this.setState({
  //         time: 'end',
  //       });
  //     } else {
  //       initializeClock(deadline);
  //     }
  //   } catch (error) {
  //     this.setState({
  //       time: '∞',
  //     });
  //   }
  // };

  // const initializeClock = (endtime) => {
  //   let timeinterval;
  //   const updateClock = () => {
  //     const t = getTimeRemaining(endtime);
  //     if (t.total <= 0) {
  //       clearInterval(timeinterval);
  //       this.setState({
  //         time: 'end',
  //       });
  //       return true;
  //     }
  //     const hours = `0${t.hours}`.slice(-2);
  //     const minutes = `0${t.minutes}`.slice(-2);
  //     this.setState({
  //       time: `${t.days}d:${hours}h:${minutes}m`,
  //     });
  //   };

  //   updateClock();
  //   timeinterval = setInterval(updateClock, 10000);
  // };

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

  // if (loader) {
  //   return (
  //     <div
  //       style={{
  //         width: '100%',
  //         height: '50vh',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         flexDirection: 'column',
  //       }}
  //     >
  //       <Loading />
  //       <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
  //         Recieving transactions
  //       </div>
  //     </div>
  //   );
  // }

  if (selected === 'progress') {
    content = (
      <Dinamics
        mobile={mobile}
        cap={marketData.marketCapEth}
        data3d={dataProgress}
      />
    );
  }

  if (selected === 'leaderboard') {
    content = <Table mobile={mobile} data={dataTable} />;
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
        {/* {!pin && (
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
        {pin && (
          <Table
            styles={{ marginBottom: 20, marginTop: 0 }}
            data={groups}
            onlyPin
            pin={pin}
          />
        )} */}
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
  };
};

export default connect(mapStateToProps)(withWeb3(PortPages));
