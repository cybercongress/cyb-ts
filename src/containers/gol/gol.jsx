import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, Route, useLocation } from 'react-router-dom';
import { Text, Pane, Tablist } from '@cybercongress/gravity';
import {
  getAmountATOM,
  getValidatorsInfo,
  getValidators,
  getCurrentNetworkLoad,
  getGraphQLQuery,
} from '../../utils/search/utils';
import { CardStatisics, Loading, LinkWindow, TabBtn } from '../../components';
import {
  cybWon,
  getDisciplinesAllocation,
  getEstimation,
} from '../../utils/fundingMath';
import TableDiscipline from './table';

import {
  fromBech32,
  exponentialToDecimal,
  formatNumber,
} from '../../utils/utils';
import ActionBarContainer from './actionBarContainer';
import LoadTab from './tab/loadTab';
import RelevanceTab from './tab/relevance';
import { setGolTakeOff } from '../../redux/actions/gol';
import setLeaderboard from './hooks/leaderboard';

import { COSMOS, TAKEOFF, WP } from '../../utils/config';

const test = {
  'tx.hash': [
    '1320F2C5F9022E21533BAB4F3E1938AD7C9CA493657C98E7435A44AA2850636B',
  ],
  'tx.height': ['1372872'],
  'transfer.recipient': ['cosmos1809vlaew5u5p24tvmse9kvgytwwr3ej7vd7kgq'],
  'transfer.amount': ['10000uatom'],
  'message.sender': ['cosmos1gw5kdey7fs9wdh05w66s0h4s24tjdvtcxlwll7'],
  'message.module': ['bank'],
  'message.action': ['send'],
  'tm.event': ['Tx'],
};

const Query = (address) =>
  `query txs {
    takeoff_aggregate(where: {donors: {_eq: "${address}"}}) {
    aggregate {
      sum {
        cybs
      }
    }
  }
}`;

function GOL({ setGolTakeOffProps, mobile, defaultAccount }) {
  const {
    data: dataLeaderboard,
    loading: loadingLeaderboard,
    progress: progressLeaderboard,
  } = setLeaderboard();
  const location = useLocation();
  const [selected, setSelected] = useState('disciplines');
  const [address, setAddress] = useState({
    addressLedger: null,
    validatorAddress: null,
    consensusAddress: null,
  });
  const [takeoff, setTakeoff] = useState({
    estimation: 0,
    amount: 0,
  });
  const [addAddress, setAddAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [herosCount, setHerosCount] = useState(0);
  const [currentNetworkLoad, setCurrentNetworkLoad] = useState(0);

  useEffect(() => {
    const feachData = async () => {
      chekPathname();
      await checkAddressLocalStorage();
      checkCurrentNetworkLoad();
      getValidatorsCount();
    };
    feachData();
  }, []);

  useEffect(() => {
    getAtom();
  }, [address]);

  useEffect(() => {
    chekPathname();
  }, [location.pathname]);

  useEffect(() => {
    checkAddressLocalStorage();
  }, [defaultAccount.name]);

  const chekPathname = () => {
    const { pathname } = location;

    if (
      pathname.match(/leaderboard/gm) &&
      pathname.match(/leaderboard/gm).length > 0
    ) {
      setSelected('leaderboard');
    } else if (
      pathname.match(/content/gm) &&
      pathname.match(/content/gm).length > 0
    ) {
      setSelected('content');
    } else {
      setSelected('disciplines');
    }
  };

  const checkAddressLocalStorage = async () => {
    let consensusAddress = null;
    let validatorAddress = null;

    const { account } = defaultAccount;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const dataValidatorAddress = fromBech32(
        account.cyber.bech32,
        'cybervaloper'
      );
      const dataGetValidatorsInfo = await getValidatorsInfo(
        dataValidatorAddress
      );
      if (dataGetValidatorsInfo !== null) {
        consensusAddress = dataGetValidatorsInfo.consensus_pubkey;
        validatorAddress = dataValidatorAddress;
      }
      setAddAddress(false);
      setAddress({
        addressLedger: account.cyber,
        validatorAddress,
        consensusAddress,
      });
    } else {
      setAddAddress(true);
      // setLoading(false);
    }
  };

  const checkCurrentNetworkLoad = async () => {
    let load = 0;
    const dataCurrentNetworkLoad = await getCurrentNetworkLoad();
    if (dataCurrentNetworkLoad !== null) {
      load = parseFloat(dataCurrentNetworkLoad.load) * 100;
    }

    setCurrentNetworkLoad(load);
  };

  const getValidatorsCount = async () => {
    const data = await getValidators();
    let count = 0;
    if (data !== null) {
      count = data.length;
    }

    setHerosCount(count);
  };

  const getAtom = async () => {
    const { addressLedger } = address;
    const amount = 0;

    const estimation = TAKEOFF.FINISH_ESTIMATION;
    let addEstimation = 0;
    let addressCosmos = null;

    if (addressLedger !== null) {
      addressCosmos = fromBech32(addressLedger.bech32, 'cosmos');
    }

    if (addressCosmos !== null) {
      const { takeoff_aggregate: takeoffAggregate } = await getGraphQLQuery(
        Query(addressCosmos)
      );
      if (
        takeoffAggregate &&
        takeoffAggregate.aggregate &&
        takeoffAggregate.aggregate.sum
      ) {
        addEstimation = takeoffAggregate.aggregate.sum.cybs;
      }
    }

    setGolTakeOffProps(
      Math.floor(addEstimation * 10 ** 9),
      Math.floor(estimation * 10 ** 9)
    );

    setTakeoff((prevState) => ({ ...prevState, estimation, amount }));
    setLoading(false);
  };

  let content;

  // if (loading) {
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
  //     </div>
  //   );
  // }

  if (selected === 'leaderboard') {
    content = (
      <Route
        path="/gol/leaderboard"
        render={() => (
          <LoadTab
            data={dataLeaderboard}
            loading={loadingLeaderboard}
            progress={progressLeaderboard}
          />
        )}
      />
    );
  }

  if (selected === 'disciplines') {
    content = (
      <TableDiscipline
        addressLedger={address.addressLedger}
        validatorAddress={address.validatorAddress}
        consensusAddress={address.consensusAddress}
        takeoffDonations={TAKEOFF.FINISH_AMOUNT}
        estimation={takeoff.estimation}
        mobile={mobile}
      />
    );
  }

  if (selected === 'content') {
    content = <Route path="/gol/content" render={() => <RelevanceTab />} />;
  }

  return (
    <div>
      <main
        // style={{ justifyContent: 'space-between' }}
        className="block-body"
      >
        <Pane
          borderLeft="3px solid #3ab793e3"
          paddingY={0}
          paddingLeft={20}
          paddingRight={5}
          marginY={5}
        >
          <Pane>Looking back, important things feel obvious.</Pane>
          <Pane>
            It takes phenomenal talent and incredible will to see them from
            afar.
          </Pane>
          <Pane>Those who can, define the future.</Pane>
          <Pane>Founders</Pane>
        </Pane>
        <Pane
          boxShadow="0px 0px 5px #36d6ae"
          paddingX={20}
          paddingY={20}
          marginY={20}
        >
          <Text fontSize="16px" color="#fff">
            Welcome to the intergalactic tournament - Game of Links. GoL is the
            main preparation stage before{' '}
            <Link to="/search/genesis">the main network launch</Link> of{' '}
            <LinkWindow to={WP}>the cyber protocol</LinkWindow>. The main goal
            of the tournament is to collectively bootstrap the{' '}
            <Link to="/brain">Superintelligence</Link>. Everyone can find
            themselves in this fascinating process: we need to set up physical
            infrastructure, upload the initial knowledge and create a reserve to
            sustain the project during its infancy. Athletes need to solve
            different parts of the puzzle and can win up to 10% of CYB in the
            Genesis.Participation requere EUL tokens which you can get by{' '}
            <Link to="/gift">claiming gift</Link>, using{' '}
            <Link to="/gol/faucet">ETH faucet</Link> or{' '}
            <Link to="/gol/takeoff">donating ATOM</Link> during Takeoff. Read
            the full rules of the tournament{' '}
            <LinkWindow to="https://cybercongress.ai/game-of-links/">
              in the organizator&apos;s blog
            </LinkWindow>
            .
          </Text>
        </Pane>
        <Pane
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
          gridGap="20px"
          width="100%"
          marginY={20}
          alignItems="center"
        >
          <Link to="/gol/load">
            <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title="Network load"
              value={`${formatNumber(currentNetworkLoad, 2)} %`}
            />
          </Link>
          <Link to="/gol/takeoff">
            <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title="Donation goal"
              value={`${formatNumber(
                (TAKEOFF.FINISH_AMOUNT / TAKEOFF.ATOMsALL) * 100,
                2
              )} %`}
            />
          </Link>
          <Link to="/heroes">
            <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title="Validator set"
              value={`${formatNumber((herosCount / 146) * 100, 2)} %`}
            />
          </Link>
        </Pane>
        <Tablist
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
          gridGap="10px"
          marginY={20}
        >
          <TabBtn
            text="Leaderboard"
            isSelected={selected === 'leaderboard'}
            to="/gol/leaderboard"
          />
          <TabBtn
            text="Disciplines"
            isSelected={selected === 'disciplines'}
            to="/gol"
          />
          <TabBtn
            text="Content"
            isSelected={selected === 'content'}
            to="/gol/content"
          />
        </Tablist>
        <Pane display="flex" marginBottom={50} justifyContent="center">
          {content}
        </Pane>
      </main>
      {!mobile && (
        <ActionBarContainer
          addAddress={addAddress}
          updateFunc={checkAddressLocalStorage}
        />
      )}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    defaultAccount: store.pocket.defaultAccount,
  };
};

const mapDispatchprops = (dispatch) => {
  return {
    setGolTakeOffProps: (amount, prize) =>
      dispatch(setGolTakeOff(amount, prize)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(GOL);
