/* eslint-disable no-await-in-loop */
import React from 'react';
import { Text, Pane, Tablist, Tab } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import {
  formatNumber,
  getStatistics,
  getValidators,
  statusNode,
  getBalance,
  getTotalEUL,
  getAmountATOM,
  getInlfation,
  getcommunityPool,
  getTxCosmos,
  getTotalSupply,
  getFollows,
  getTweet,
  getContentByCid,
  getContent,
} from '../../utils/search/utils';
import { roundNumber } from '../../utils/utils';
import { CardStatisics, Loading } from '../../components';
import { getEstimation } from '../../utils/fundingMath';
import injectWeb3 from './web3';
import injectKeplr from '../../components/web3/injectKeplr';

import {
  CYBER,
  AUCTION,
  GENESIS_SUPPLY,
  TAKEOFF,
  TAKEOFF_SUPPLY,
  COSMOS,
  PATTERN_CYBER,
} from '../../utils/config';
import { getProposals } from '../../utils/governance';

import ActionBarContainer from './actionBarContainer';
import ActionBarConnect from '../Wallet/actionBarConnect';
import {
  GovernmentTab,
  MainTab,
  CybernomicsTab,
  KnowledgeTab,
  AppsTab,
  HelpTab,
  PathTab,
} from './tabs';

import db from '../../db';

const { DIVISOR_CYBER_G, CYBER_WEBSOCKET_URL } = CYBER;

const dateFormat = require('dateformat');

const TabBtn = ({ text, isSelected, onSelect, to }) => (
  <Link to={to}>
    <Tab
      key={text}
      isSelected={isSelected}
      onSelect={onSelect}
      paddingX={5}
      paddingY={20}
      marginX={3}
      borderRadius={4}
      color="#36d6ae"
      boxShadow="0px 0px 5px #36d6ae"
      fontSize="16px"
      whiteSpace="nowrap"
      width="100%"
    >
      {text}
    </Tab>
  </Link>
);

const test = {
  'tx.hash': [
    '1320F2C5F9022E21533BAB4F3E1938AD7C9CA493657C98E7435A44AA2850636B',
  ],
  'tx.height': ['1489670'],
  'cybermeta.subject': ['cyber1gw5kdey7fs9wdh05w66s0h4s24tjdvtcp5fhky'],
  'cyberlink.objectFrom': ['QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx'],
  'cyberlink.objectTo': ['QmZb8DZvUbHAtiZk529TFV4REeJeJvSnZAfu7bVE4V2wH3'],
  'message.module': ['bank'],
  'message.action': ['send'],
  'tm.event': ['Tx'],
};

class Brain extends React.PureComponent {
  ws = new WebSocket(CYBER_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      inlfation: 0,
      addressPocket: null,
      linksCount: 0,
      cidsCount: 0,
      accountsCount: 0,
      totalCyb: 0,
      stakedCyb: 0,
      activeValidatorsCount: 0,
      selected: 'main',
      loading: true,
      chainId: '',
      amount: 0,
      takeofPrice: 0,
      capATOM: 0,
      communityPool: 0,
      proposals: 0,
      donation: 0,
      twit: {},
      addressFollowData: {},
      tweetData: [],
      loadingTwit: true,
      cybernomics: {
        gol: {
          supply: 0,
          price: 0,
          cap: 0,
        },
        eul: {
          supply: 0,
          price: 0,
          cap: 0,
        },
        cyb: {
          supply: 0,
          price: 0,
          cap: 0,
        },
      },
    };
  }

  async componentDidMount() {
    this.chekPathname();
    await this.checkAddressLocalStorage();
    this.getFollow();
    this.getStatisticsBrain();
    // this.getPriceGol();
    this.getTxsCosmos();
    this.getContract();
    await this.getDataWS();
  }

  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props;
    const { tweetData } = this.state;
    if (prevProps.location.pathname !== location.pathname) {
      this.chekPathname();
    }
    if (prevState.tweetData !== tweetData) {
      this.convertTweetData();
    }
  }

  update = async () => {
    console.log('object :>> ');
    await this.checkAddressLocalStorage();
    this.getFollow();
  };

  getFollow = async () => {
    const { addressPocket } = this.state;
    const { node } = this.props;
    let responseFollows = null;

    this.setState({
      loadingTwit: true,
    });

    if (addressPocket !== null) {
      responseFollows = await getFollows(addressPocket.bech32);

      if (responseFollows !== null && responseFollows.txs) {
        responseFollows.txs.forEach(async item => {
          let addressResolve;
          const cid = item.tx.value.msg[0].value.links[0].to;
          const dataIndexdDb = await db.table('following').get({ cid });
          if (dataIndexdDb !== undefined) {
            addressResolve = dataIndexdDb.content;
          } else {
            const responseGetContent = await getContent(cid);
            addressResolve = responseGetContent;
            const ipfsContentAddtToInddexdDB = {
              cid,
              content: addressResolve,
            };
            db.table('following')
              .add(ipfsContentAddtToInddexdDB)
              .then(id => {
                console.log('item :>> ', id);
              });
          }
          if (addressResolve && addressResolve !== null) {
            const addressFollow = addressResolve;
            if (addressFollow.match(PATTERN_CYBER)) {
              this.setState(itemState => {
                return {
                  addressFollowData: {
                    ...itemState.addressFollowData,
                    [addressFollow]: cid,
                  },
                };
              });
              const responseTwit = await getTweet(addressFollow);
              if (
                responseTwit &&
                responseTwit.txs &&
                responseTwit.txs.length > 0
              ) {
                this.setState(prevState => {
                  return {
                    tweetData: [...prevState.tweetData, ...responseTwit.txs],
                  };
                });
              }
            }
          }
        });
      }
    } else {
      const responseTwit = await getTweet(CYBER.CYBER_CONGRESS_ADDRESS);
      if (responseTwit && responseTwit.txs && responseTwit.txs.length > 0) {
        this.setState(prevState => {
          return {
            tweetData: [...prevState.tweetData, ...responseTwit.txs],
          };
        });
      }
    }
  };

  getDataWS = async () => {
    this.ws.onopen = () => {
      console.log('connected Feed');
      this.ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'subscribe',
          id: '0',
          params: {
            query:
              "tm.event='Tx' AND message.action='link' AND cyberlink.objectFrom='QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx'",
          },
        })
      );
    };

    this.ws.onmessage = async evt => {
      const message = JSON.parse(evt.data);
      if (message.result && Object.keys(message.result).length > 0) {
        this.updateWs(message.result.events);
      }
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  updateWs = async data => {
    const { addressFollowData } = this.state;
    const { node } = this.props;
    const subject = data['cybermeta.subject'][0];
    const objectTo = data['cyberlink.objectTo'][0];
    const d = new Date();
    const timestamp = dateFormat(d, 'isoUtcDateTime');
    if (
      Object.keys(addressFollowData).length > 0 &&
      Object.prototype.hasOwnProperty.call(addressFollowData, subject)
    ) {
      this.setState(item => {
        return {
          twit: {
            [objectTo]: {
              status: node !== null ? 'understandingState' : 'impossibleLoad',
              text: objectTo,
              address: subject,
              content: false,
              time: timestamp,
            },
            ...item.twit,
          },
        };
      });
    }
  };

  convertTweetData = () => {
    const { node } = this.props;
    const { tweetData } = this.state;
    let twit = {};

    if (tweetData.length > 0) {
      twit = tweetData.reduce(
        (obj, item) => ({
          ...obj,
          [item.tx.value.msg[0].value.links[0].to]: {
            status: node !== null ? 'understandingState' : 'impossibleLoad',
            text: item.tx.value.msg[0].value.links[0].to,
            address: item.tx.value.msg[0].value.address,
            content: false,
            time: item.timestamp,
          },
        }),
        {}
      );
    }

    this.setState({
      twit,
      loadingTwit: false,
    });
  };

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (
      pathname.match(/cybernomics/gm) &&
      pathname.match(/cybernomics/gm).length > 0
    ) {
      this.select('cybernomics');
    } else if (
      pathname.match(/knowledge/gm) &&
      pathname.match(/knowledge/gm).length > 0
    ) {
      this.select('knowledge');
    } else if (
      pathname.match(/government/gm) &&
      pathname.match(/government/gm).length > 0
    ) {
      this.select('government');
    } else if (
      pathname.match(/apps/gm) &&
      pathname.match(/apps/gm).length > 0
    ) {
      this.select('apps');
    } else if (
      pathname.match(/help/gm) &&
      pathname.match(/help/gm).length > 0
    ) {
      this.select('help');
    } else if (pathname.match(/gol/gm) && pathname.match(/gol/gm).length > 0) {
      this.select('gol');
    } else {
      this.select('main');
    }
  };

  getContract = async () => {
    const { cybernomics } = this.state;
    const {
      contract: { methods },
    } = this.props;
    const roundThis = await methods.today().call();

    const totalSupplyEul = await getTotalSupply();
    const createOnDay = await methods.createOnDay(roundThis).call();
    const dailyTotals = await methods.dailyTotals(roundThis).call();

    const currentPrice = dailyTotals / (createOnDay * Math.pow(10, 9));
    cybernomics.gol = {
      supply: parseFloat(AUCTION.TOKEN_ALOCATION * CYBER.DIVISOR_CYBER_G),
      price: currentPrice,
      cap: parseFloat(currentPrice * AUCTION.TOKEN_ALOCATION),
    };

    cybernomics.eul = {
      supply: parseFloat(totalSupplyEul),
      price: currentPrice,
      cap: parseFloat((totalSupplyEul / CYBER.DIVISOR_CYBER_G) * currentPrice),
    };

    this.setState({
      cybernomics,
    });
  };

  getTxsCosmos = async () => {
    const dataTx = await getTxCosmos();
    console.log(dataTx);
    if (dataTx !== null) {
      this.getATOM(dataTx.txs);
    }
  };

  getATOM = async dataTxs => {
    const { cybernomics } = this.state;
    let amount = 0;
    let currentPrice = 0;
    let estimation = 0;

    if (dataTxs) {
      for (let item = 0; item < dataTxs.length; item += 1) {
        let temE = 0;
        const val =
          Number.parseInt(
            dataTxs[item].tx.value.msg[0].value.amount[0].amount,
            10
          ) / COSMOS.DIVISOR_ATOM;
        temE = getEstimation(estimation, val);
        amount += val;
        estimation += temE;
      }
    }

    currentPrice = (40 * estimation + 1000) / 1000;

    console.log('currentPrice', currentPrice, amount);

    const supplyEUL = parseFloat(GENESIS_SUPPLY);
    const capATOM = (supplyEUL / DIVISOR_CYBER_G) * currentPrice;
    console.log('capATOM', capATOM);

    cybernomics.cyb = {
      cap: capATOM,
      price: currentPrice,
      supply: GENESIS_SUPPLY,
    };

    const donation = amount / TAKEOFF.ATOMsALL;

    this.setState({
      cybernomics,
      donation,
    });
  };

  checkAddressLocalStorage = async () => {
    const localStoragePocketAccount = await localStorage.getItem(
      'pocketAccount'
    );
    const localStoragePocket = await localStorage.getItem('pocket');
    if (localStoragePocket !== null) {
      const localStoragePocketData = JSON.parse(localStoragePocket);
      const keyPocket = Object.keys(localStoragePocketData)[0];
      this.setState({
        addressPocket: {
          bech32: keyPocket,
          keys: localStoragePocketData[keyPocket].keys,
        },
        addAddress: false,
      });
      this.getAddressInfo();
    } else if (localStoragePocketAccount !== null) {
      const localStoragePocketAccountData = JSON.parse(
        localStoragePocketAccount
      );
      if (localStoragePocket === null) {
        const keys0 = Object.keys(localStoragePocketAccountData)[0];
        localStorage.setItem(
          'pocket',
          JSON.stringify({ [keys0]: localStoragePocketAccountData[keys0] })
        );
        await this.setState({
          addressPocket: {
            bech32: keys0,
            keys: localStoragePocketAccountData[keys0].keys,
          },
          addAddress: false,
        });
        this.getAddressInfo();
      }
    } else {
      this.setState({
        addAddress: true,
        loading: false,
      });
    }
  };

  getAddressInfo = async () => {
    const { addressPocket } = this.state;
    const addressInfo = {
      address: '',
      amount: '',
      token: '',
      keys: '',
    };
    let total = 0;

    const result = await getBalance(addressPocket.bech32);
    console.log('result', result);

    if (result) {
      total = await getTotalEUL(result);
    }
    this.setState({
      addAddress: false,
      loading: false,
      // addressInfo,
      amount: total.total,
    });
  };

  getStatisticsBrain = async () => {
    const statisticContainer = await getStatistics();
    const validatorsStatistic = await getValidators();
    const status = await statusNode();
    const dataInlfation = await getInlfation();
    const dataCommunityPool = await getcommunityPool();
    const dataProposals = await getProposals();
    const {
      linksCount,
      cidsCount,
      accountsCount,
      height,
      bandwidthPrice,
      bondedTokens,
      supplyTotal,
    } = statisticContainer;
    let inlfation = 0;
    let communityPool = 0;
    const activeValidatorsCount = validatorsStatistic;

    const chainId = status.node_info.network;

    const totalCyb = supplyTotal;
    const stakedCyb = bondedTokens / totalCyb;
    const linkPrice = (400 * +bandwidthPrice).toFixed(0);

    if (dataInlfation !== null) {
      inlfation = dataInlfation;
    }

    if (dataCommunityPool !== null) {
      communityPool = Math.floor(parseFloat(dataCommunityPool[0].amount));
    }

    this.setState({
      linksCount,
      cidsCount,
      proposals: dataProposals.length,
      accountsCount,
      totalCyb,
      communityPool,
      stakedCyb,
      activeValidatorsCount: activeValidatorsCount.length,
      chainId,
      inlfation,
    });
  };

  select = selected => {
    this.setState({ selected });
  };

  render() {
    const {
      linksCount,
      cidsCount,
      accountsCount,
      totalCyb,
      stakedCyb,
      activeValidatorsCount,
      addAddress,
      amount,
      loading,
      chainId,
      takeofPrice,
      capATOM,
      selected,
      communityPool,
      inlfation,
      cybernomics,
      proposals,
      gol,
      donation,
      twit,
      loadingTwit,
      addressPocket,
    } = this.state;
    const { keplr, mobile, node } = this.props;

    let content;

    if (loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Loading />
        </div>
      );
    }

    if (selected === 'main') {
      content = (
        <MainTab
          twit={twit}
          mobile={mobile}
          nodeIpfs={node}
          loadingTwit={loadingTwit}
        />
      );
    }

    if (selected === 'knowledge') {
      content = (
        <Route
          path="/brain/knowledge"
          render={() => (
            <KnowledgeTab
              linksCount={parseInt(linksCount, 10)}
              cidsCount={parseInt(cidsCount, 10)}
              accountsCount={parseInt(accountsCount, 10)}
            />
          )}
        />
      );
    }

    if (selected === 'cybernomics') {
      content = (
        <Route
          path="/brain/cybernomics"
          render={() => <CybernomicsTab data={cybernomics} />}
        />
      );
    }

    if (selected === 'government') {
      content = (
        <Route
          path="/brain/government"
          render={() => (
            <GovernmentTab
              proposals={proposals}
              communityPool={communityPool}
              activeValidatorsCount={activeValidatorsCount}
              stakedCyb={stakedCyb}
              inlfation={inlfation}
            />
          )}
        />
      );
    }

    if (selected === 'apps') {
      content = <Route path="/brain/apps" render={() => <AppsTab />} />;
    }

    if (selected === 'help') {
      content = <Route path="/brain/help" render={() => <HelpTab />} />;
    }

    if (selected === 'gol') {
      content = (
        <Route
          path="/brain/gol"
          render={() => (
            <PathTab
              cybernomics={cybernomics}
              activeValidatorsCount={activeValidatorsCount}
              donation={donation}
            />
          )}
        />
      );
    }

    return (
      <div>
        <main className="block-body">
          {amount === 0 && !addAddress && (
            <Pane
              boxShadow="0px 0px 5px #36d6ae"
              paddingX={20}
              paddingY={20}
              marginY={20}
            >
              <Text fontSize="16px" color="#fff">
                You do not have control over the brain. You need EUL tokens to
                let Her hear you. If you came from Ethereum or Cosmos you can{' '}
                <Link to="/gift">claim the gift</Link> of the Gods,{' '}
                <Link to="/gol/faucet">get with ETH</Link>
                on faucet or <Link to="/gol/takeoff">donate ATOM</Link> during
                takeoff. Then enjoy the greatest tournament in the universe:{' '}
                <Link to="/gol">Game of Links</Link>.
              </Text>
            </Pane>
          )}

          {addAddress && (
            <Pane
              boxShadow="0px 0px 5px #36d6ae"
              paddingX={20}
              paddingY={20}
              marginY={20}
            >
              <Text fontSize="16px" color="#fff">
                Subscribe to someone to make your feed work. Until then, we'll
                show you the project feed. Start by adding a ledger to{' '}
                <Link to="/pocket">your pocket</Link>.
              </Text>
            </Pane>
          )}

          <Tablist
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
            gridGap="10px"
            marginTop={25}
          >
            <TabBtn
              text="Knowledge"
              isSelected={selected === 'knowledge'}
              to="/brain/knowledge"
            />
            <TabBtn
              text="Game of Links"
              isSelected={selected === 'gol'}
              to="/brain/gol"
            />
            <TabBtn
              text="Cybernomics"
              isSelected={selected === 'cybernomics'}
              to="/brain/cybernomics"
            />
            <TabBtn text="Feed" isSelected={selected === 'main'} to="/brain" />
            <TabBtn
              text="Government"
              isSelected={selected === 'government'}
              to="/brain/government"
            />
            <TabBtn
              text="Apps"
              isSelected={selected === 'apps'}
              to="/brain/apps"
            />
            <TabBtn
              text="Help"
              isSelected={selected === 'help'}
              to="/brain/help"
            />
          </Tablist>
          <Pane
            marginTop={50}
            marginBottom={50}
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gridGap="20px"
          >
            {content}
          </Pane>
        </main>
        {!mobile && !addAddress && (
          <ActionBarContainer
            keplr={keplr}
            updateFunc={this.update}
            addressPocket={addressPocket}
          />
        )}
        {!mobile && addAddress && (
          <ActionBarConnect
            keplr={keplr}
            addAddress={addAddress}
            updateAddress={this.update}
            brain
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(injectWeb3(injectKeplr(Brain)));
