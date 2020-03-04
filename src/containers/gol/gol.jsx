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
import { cybWon, getDisciplinesAllocation } from '../../utils/fundingMath';
import {
  Delegation,
  Load,
  Uptime,
  FVS,
  Euler4,
  Community,
  Takeoff,
  Relevance,
} from './tabs';

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
      addressLedger: null,
      selectGlobal: 'disciplines',
      selectedMaster: 'relevance',
      selectedPlay: 'uptime',
      loading: false,
      cybWon: 0,
      myGOLs: 0,
      topLink: [],
      takeoffDonations: 0,
      currentPrize: 0,
      items: 10,
      hasMoreItems: true,
      perPage: 10,
    };
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    this.getRelevance();
    // this.getMyGOLs();
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
      cybWon: won,
    });
  };

  getRelevance = async () => {
    let topLink = [];
    const { perPage } = this.state;

    const data = await getRelevance(perPage);

    if (data) {
      topLink = data.cids;
    }

    this.setState({
      topLink,
      loading: false,
    });
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
            key={index}
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

  loadMore(page) {
    const { items, perPage } = this.state;
    console.log('df');
    if (items > 50 || items === 50) {
      this.setState({ hasMoreItems: false });
    } else {
      this.setState({ items: items + 10, perPage: perPage + 10 });
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
      cybWon,
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

    if (selectedPlay === 'delegation') {
      contentPlay = <Delegation />;
    }

    if (selectedMaster === 'load') {
      contentMaster = <Load />;
    }

    if (selectedMaster === 'relevance') {
      contentMaster = (
        <Relevance
          hasMoreItems={hasMoreItems}
          showItems={this.showItems()}
          loadMore={this.loadMore.bind(this)}
        />
      );
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
              {Object.keys(DISTRIBUTION).map(key => {
                if (key !== 'takeoff') {
                  return (
                    <Table.Row key={key} borderBottom="none">
                      <Table.TextCell>
                        <Text fontSize="16px" color="#fff">
                          {key}
                        </Text>
                      </Table.TextCell>
                      <Table.TextCell textAlign="end">
                        <Text fontSize="16px" color="#fff">
                          {DISTRIBUTION[key]}
                        </Text>
                      </Table.TextCell>
                      <Table.TextCell textAlign="end">
                        <Text fontSize="16px" color="#fff">
                          {Math.floor(
                            (cybWon / DISTRIBUTION.takeoff) * DISTRIBUTION[key]
                          )}
                        </Text>
                      </Table.TextCell>
                    </Table.Row>
                  );
                }
                return null;
              })}
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
            <Indicators title={T.gol.myGOLs} value="∞" />
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

export default GOL;
