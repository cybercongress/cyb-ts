import React from 'react';
import {
  Text,
  Pane,
  Heading,
  CardHover,
  Icon,
  Tablist,
  Tab,
  Button,
  ActionBar,
  SearchItem,
  TableEv as Table,
} from '@cybercongress/gravity';
import LocalizedStrings from 'react-localization';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import InfiniteScroll from 'react-infinite-scroller';
import { CosmosDelegateTool } from '../../utils/ledger';
import withWeb3 from '../../components/web3/withWeb3';
import {
  formatNumber,
  getStatistics,
  getValidators,
  statusNode,
  getRelevance,
  getRankGrade,
  getTotalEUL,
  getBalance,
  getAmountATOM,
} from '../../utils/search/utils';
import { roundNumber, asyncForEach } from '../../utils/utils';
import {
  CardStatisics,
  ConnectLadger,
  Loading,
  FormatNumber,
  Indicators,
  Card,
} from '../../components';
import Dinamics from './diagram';
import { cybWon, getDisciplinesAllocation } from '../../utils/fundingMath';

import { i18n } from '../../i18n/en';

import {
  CYBER,
  LEDGER,
  AUCTION,
  COSMOS,
  TAKEOFF,
  DISTRIBUTION,
  GENESIS_SUPPLY,
} from '../../utils/config';

import ActionBarContainer from './actionBarContainer';

const { CYBER_NODE_URL, DIVISOR_CYBER_G, DENOM_CYBER_G } = CYBER;

const {
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  LEDGER_VERSION_REQ,
} = LEDGER;

const T = new LocalizedStrings(i18n);

const TabBtn = ({ text, isSelected, onSelect }) => (
  <Tab
    key={text}
    isSelected={isSelected}
    onSelect={onSelect}
    paddingX={50}
    paddingY={20}
    marginX={3}
    borderRadius={4}
    color="#36d6ae"
    boxShadow="0px 0px 5px #36d6ae"
    fontSize="16px"
    whiteSpace="nowrap"
  >
    {text}
  </Tab>
);

class GOL extends React.Component {
  ws = new WebSocket(COSMOS.GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      accountsETH: null,
      ledgerVersion: [0, 0, 0],
      linksCount: 0,
      cidsCount: 0,
      accsCount: 0,
      txCount: 0,
      blockNumber: 0,
      linkPrice: 0,
      totalCyb: 0,
      stakedCyb: 0,
      activeValidatorsCount: 0,
      selectGlobal: 'disciplines',
      selectedMaster: 'relevance',
      selectedPlay: 'uptime',
      selected: '',
      loading: false,
      chainId: '',
      amount: 0,
      supplyEUL: 0,
      takeofPrice: 0,
      capATOM: 0,
      averagePrice: 0,
      capETH: 0,
      myGOLs: 0,
      topLink: [],
      takeoffDonations: 0,
      currentPrize: 0,
      items: 20,
      hasMoreItems: true,
    };
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    this.getRelevance();
    this.getMyGOLs();
    this.getMyEULs();
    this.getDataWS();
  }

  getDataWS = async () => {
    this.ws.onopen = () => {
      console.log('connected');
    };

    this.ws.onmessage = async evt => {
      const message = JSON.parse(evt.data);
      console.log('txs', message);
      this.getAtom(message);
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  checkAddressLocalStorage = async () => {
    let address = [];

    const localStorageStory = await localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLedger: address });
      this.getMyEULs();
    } else {
      this.setState({
        addAddress: true,
        loading: false,
      });
    }
  };

  getMyGOLs = async () => {
    const { accounts, contractToken } = this.props;

    let myGOLs = 0;

    const balanceOfTx = await contractToken.methods.balanceOf(accounts).call();

    if (balanceOfTx) {
      myGOLs = balanceOfTx;
    }

    this.setState({
      myGOLs,
    });
  };

  getMyEULs = async () => {
    const { addressLedger } = this.state;

    let myEULs = 0;

    const result = await getBalance(addressLedger.bech32);

    if (result) {
      myEULs = getTotalEUL(result);
    }

    this.setState({
      myEULs: Math.floor(myEULs),
    });
  };

  getAtom = async dataTxs => {
    let amount = 0;
    let won = 0;
    let allocation = 0;
    let currentPrize = 0;

    if (dataTxs) {
      amount = await getAmountATOM(dataTxs);
    }

    won = cybWon(amount);
    allocation = getDisciplinesAllocation(amount);

    currentPrize = won + allocation;

    this.setState({
      takeoffDonations: amount,
      currentPrize,
    });
  };

  getRelevance = async () => {
    let topLink = [];

    const data = await getRelevance();

    if (data) {
      topLink = data.cids;
    }

    this.setState({
      topLink,
      loading: false,
    });
  };

  select = selected => {
    this.setState({ selected });
  };

  selectedMaster = selectedMaster => {
    this.setState({ selectedMaster });
  };

  selectedPlay = selectedPlay => {
    this.setState({ selectedPlay });
  };

  selectGlobal = selectGlobal => {
    this.setState({ selectGlobal });
  };

  onClickGetAddressLedger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      loading: true,
    });
  };

  fetchMoreData = () => {
    console.log('fetchMoreData');
    this.setState({
      items: this.state.items + 20,
    });
  };

  showItems() {
    const topLinkItems = [];
    const { topLink, items } = this.state;

    let linkData = items;

    if (items > topLink.length) {
      linkData = topLink.length;
    }

    if (topLink.length > 0) {
      for (let index = 0; index < linkData; index += 1) {
        const item = (
          <Pane
            display="grid"
            gridTemplateColumns="50px 1fr"
            alignItems="baseline"
            gridGap="5px"
          >
            <Text textAlign="end" fontSize="16px" color="#fff">
              #{index + 1}
            </Text>
            <Pane marginY={0} marginX="auto" width="70%">
              <SearchItem
                key={topLink[index].cid}
                hash={topLink[index].cid}
                rank={topLink[index].rank}
                grade={getRankGrade(topLink[index].rank)}
                status="success"
                width="70%"
              >
                {topLink[index].cid}
              </SearchItem>
            </Pane>
          </Pane>
        );

        topLinkItems.push(item);
      }
    }
    return topLinkItems;
  }

  loadMore() {
    const { items, topLink } = this.state;
    if (items > topLink.length) {
      this.setState({ hasMoreItems: false });
    } else {
      setTimeout(() => {
        this.setState({ items: items + 20 });
      }, 2000);
    }
  }

  render() {
    const {
      loading,
      selectedMaster,
      myGOLs,
      myEULs,
      takeoffDonations,
      currentPrize,
      hasMoreItems,
      selectGlobal,
      selectedPlay,
    } = this.state;

    let content;
    let contentPlay;
    let contentMaster;

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

    // const topLinkItems = topLink.map(item => (
    //   <SearchItem
    //     key={item.cid}
    //     hash={item.cid}
    //     rank={item.rank}
    //     grade={item.grade}
    //     status="success"
    //   >
    //     {item.cid}
    //   </SearchItem>
    // ));

    const Master = () => (
      <div style={{ width: '100%' }}>
        <Tablist
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
          gridGap="10px"
          width="100%"
          marginBottom={20}
          // marginTop={25}
        >
          <TabBtn
            text="Community"
            isSelected={selectedMaster === 'community'}
            onSelect={() => this.selectedMaster('community')}
          />
          <TabBtn
            text="Load"
            isSelected={selectedMaster === 'load'}
            onSelect={() => this.selectedMaster('load')}
          />
          <TabBtn
            text="Relevance"
            isSelected={selectedMaster === 'relevance'}
            onSelect={() => this.selectedMaster('relevance')}
          />
          <TabBtn
            text="Takeoff"
            isSelected={selectedMaster === 'takeoff'}
            onSelect={() => this.selectedMaster('takeoff')}
          />
        </Tablist>
        {contentMaster}
      </div>
    );

    const Play = () => (
      <div style={{ width: '100%' }}>
        <Tablist
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
          gridGap="10px"
          width="100%"
          marginBottom={20}
        >
          <TabBtn
            text="Uptime"
            isSelected={selectedPlay === 'uptime'}
            onSelect={() => this.selectedPlay('uptime')}
          />
          <TabBtn
            text="FVS"
            isSelected={selectedPlay === 'FVS'}
            onSelect={() => this.selectedPlay('FVS')}
          />
          <TabBtn
            text="Euler-4"
            isSelected={selectedPlay === 'euler4'}
            onSelect={() => this.selectedPlay('euler4')}
          />

          <TabBtn
            text="Delegation"
            isSelected={selectedPlay === 'delegation'}
            onSelect={() => this.selectedPlay('delegation')}
          />
        </Tablist>
        {contentPlay}
      </div>
    );

    const Delegation = () => (
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
        width="100%"
      >
        <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
          Get more voting power for your validator - get more rewards!
        </Text>
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          This disciplines is social discipline with max prize of 5 TCYB. Huge
          chunk of CYB stake allocated to all Ethereans and Cosmonauts. The more
          you spread, the more users will claim its allocation, the more voting
          power as validators you will have in Genesis. Details of reward
          calculation you can find in{' '}
          <a target="_blank" href="https://cybercongress.ai/game-of-links/">
            Game of Links rules
          </a>
        </Text>
      </Pane>
    );

    const Load = () => (
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
        width="100%"
      >
        <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
          Submit as much cyberlinks as possible!
        </Text>
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          We need to test the network under heavy load. Testing of decentralized
          networks under load near real conditions is hard and expensive. So we
          invite you to submit as much cyberlinks as possible. Max reward for
          this discipline is 6 TCYB. Details of reward calculation you can find
          in{' '}
          <a target="_blank" href="https://cybercongress.ai/game-of-links/">
            Game of Links rules
          </a>
        </Text>
      </Pane>
    );

    const Uptime = () => (
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
        width="100%"
      >
        <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
          Setup you validator and get rewards for precommit counts!
        </Text>
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          Max rewards for uptime is 2 TCYB.{' '}
          <a
            target="_blank"
            href="https://cybercongress.ai/docs/cyberd/run_validator/"
          >
            Run validator, become the hero!
          </a>
        </Text>
      </Pane>
    );
    const FVS = () => (
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
        width="100%"
      >
        <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
          Go on and convince your friend to become a hero!
        </Text>
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          Full Validator Set discipline. We want to bootstrap the cyber main
          network with full validators set. So we assign group bonus to all
          validators for self-organization. If the set of validators will
          increase over or is equal to 100, and this number of validators can
          last for 10000 blocks, we will allocate an additional 2 TCYB to
          validators who take part in genesis. If the number of validators will
          increase to or over 146, under the same conditions we will allocate an
          additional 3 TCYB. All rewards in that discipline will be distributed
          to validators per capita. Details of reward calculation you can find
          in{' '}
          <a target="_blank" href="https://cybercongress.ai/game-of-links/">
            Game of Links rules
          </a>
        </Text>
      </Pane>
    );
    const Euler4 = () => (
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
        width="100%"
      >
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          Oh! You miss the boat. This discipline is the reward for validators
          who helped us test the network during 2019 year. Thank you for
          participation.
        </Text>
      </Pane>
    );

    const Community = () => (
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
        width="100%"
      >
        <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
          Propose something that matters!
        </Text>
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          2 TEUL allocated to community pool in euler-5. All governance payouts
          will be migrated to main network. That means that up to 2 TCYB can be
          allocated for community proposals during Game of Links.{' '}
          <a target="_blank" href="https://cybercongress.ai/game-of-links/">
            Details here
          </a>
        </Text>
      </Pane>
    );

    const Takeoff = () => (
      <Pane
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        display="flex"
        paddingY="20px"
        paddingX="20%"
        textAlign="justify"
        width="100%"
      >
        <Text lineHeight="24px" marginBottom={20} color="#fff" fontSize="18px">
          Help sustain the project, get the will!
        </Text>
        <Text lineHeight="24px" color="#fff" fontSize="18px">
          Without takeoff round it is impossible for cyber•Congress to continue
          development of the project. Overall Game of Links rewards depends on
          the Takeoff donations results. Takeoff round will be launched after
          the network accept the proposal with the hash of the cyber.page app
          with donation functionality. Details of Takeoff donations in{' '}
          <a target="_blank" href="https://cybercongress.ai/game-of-links/">
            Game of Links
          </a>{' '}
          rules. Subscribe to our{' '}
          <a target="_blank" href="https://cybercongress.ai/post/">
            blog
          </a>{' '}
          to get updates.
        </Text>
      </Pane>
    );

    const Relevance = () => (
      <Pane width="100%">
        <Pane textAlign="center" marginBottom={10} paddingX="20%" width="100%">
          <Text lineHeight="24px" color="#fff" fontSize="18px">
            Submit the most ranked content first!
            <br /> Details of reward calculation you can find in{' '}
            <a target="_blank" href="https://cybercongress.ai/game-of-links/">
              Game of Links rules
            </a>
          </Text>
        </Pane>
        <InfiniteScroll
          // pageStart={0}
          loadMore={this.loadMore.bind(this)}
          hasMore={hasMoreItems}
          loader={
            <Pane textAlign="center">
              <Loading />
            </Pane>
          }
          // useWindow={false}
        >
          {this.showItems()}
        </InfiniteScroll>
      </Pane>
    );

    if (selectedPlay === 'delegation') {
      contentPlay = <Delegation />;
    }

    if (selectedMaster === 'load') {
      contentMaster = <Load />;
    }

    if (selectedMaster === 'relevance') {
      contentMaster = <Relevance />;
    }

    if (selectedMaster === 'community') {
      contentMaster = <Community />;
    }

    if (selectedMaster === 'takeoff') {
      contentMaster = <Takeoff />;
    }

    if (selectGlobal === 'master') {
      content = <Master />;
    }

    if (selectGlobal === 'play') {
      content = <Play />;
    }

    if (selectGlobal === 'disciplines') {
      content = (
        <Pane width="100%">
          <Pane textAlign="center" width="100%">
            <Text lineHeight="24px" color="#fff" fontSize="18px">
              Allocations of CYB rewards by discipline
            </Text>
          </Pane>

          <Dinamics />
          <Table>
            <Table.Head
              style={{
                backgroundColor: '#000',
                borderBottom: '1px solid #ffffff80',
              }}
            >
              <Table.TextHeaderCell textAlign="center">
                <Text fontSize="18px" color="#fff">
                  Discipline
                </Text>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell textAlign="center">
                <Text fontSize="18px" color="#fff">
                  CYB reward
                </Text>
              </Table.TextHeaderCell>
            </Table.Head>
            <Table.Body
              style={{
                backgroundColor: '#000',
                overflowY: 'hidden',
                padding: 7,
              }}
            >
              {DISTRIBUTION.map((item, index) => (
                <Table.Row key={index} borderBottom="none">
                  <Table.TextCell>
                    <Text fontSize="16px" color="#fff">
                      {item.group}
                    </Text>
                  </Table.TextCell>
                  <Table.TextCell textAlign="end">
                    <Text fontSize="16px" color="#fff">
                      {`${formatNumber(item.amount)} (${roundNumber(
                        (item.amount / GENESIS_SUPPLY) * 100,
                        3
                      )}%)`}
                    </Text>
                  </Table.TextCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Pane>
      );
    }

    if (selectedPlay === 'uptime') {
      contentPlay = <Uptime />;
    }

    if (selectedPlay === 'FVS') {
      contentPlay = <FVS />;
    }

    if (selectedPlay === 'euler4') {
      contentPlay = <Euler4 />;
    }

    // if (selected === 'communityPool') {
    //   content = <CybernomicsGOL />;
    // }

    return (
      <div>
        <main
          // style={{ justifyContent: 'space-between' }}
          className="block-body"
        >
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginY={20}
          >
            <Text fontSize="16px" color="#fff">
              Game of Links is main preparation before cyber main network
              launch. Participants of takeoff donations and 7 disciplines could
              get max prize in terms of 10% of CYB in Genesis.{' '}
              <a target="_blank" href="https://cybercongress.ai/game-of-links/">
                Details here
              </a>
            </Text>
          </Pane>
          <Pane
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
            gridGap="20px"
            width="100%"
            marginY={50}
            alignItems="center"
          >
            <Indicators title={T.gol.myGOLs} value={formatNumber(myGOLs)} />
            <Indicators title={T.gol.myEULs} value={formatNumber(myEULs)} />
            <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title={T.gol.maxPrize}
              value="100 TCYB"
            />
            <Indicators title={T.gol.currentPrize} value="12 TCYB" />
            <Indicators
              title={T.gol.takeoff}
              value={`${formatNumber(takeoffDonations)} ATOMs`}
            />
          </Pane>
          <Tablist
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
            gridGap="10px"
            // marginTop={25}
          >
            <TabBtn
              text="Master's path"
              isSelected={selectGlobal === 'master'}
              onSelect={() => this.selectGlobal('master')}
            />
            <TabBtn
              text="Disciplines"
              isSelected={selectGlobal === 'disciplines'}
              onSelect={() => this.selectGlobal('disciplines')}
            />
            <TabBtn
              text="Hero's path"
              isSelected={selectGlobal === 'play'}
              onSelect={() => this.selectGlobal('play')}
            />
          </Tablist>
          <Pane
            display="flex"
            marginTop={20}
            marginBottom={50}
            justifyContent="center"
          >
            {content}
          </Pane>
        </main>
        {/* <ActionBarContainer
          addAddress={addAddress}
          cleatState={this.cleatState}
          updateFunc={this.checkAddressLocalStorage}
        /> */}
      </div>
    );
  }
}

export default withWeb3(GOL);
