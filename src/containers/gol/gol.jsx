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
import {
  formatNumber,
  getTotalEUL,
  getBalance,
  getAmountATOM,
  getAccountBandwidth,
  getIndexStats,
} from '../../utils/search/utils';
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
      won: 0,
      myGOLs: 0,
      topLink: [],
      takeoffDonations: 0,
      currentPrize: 0,
      items: 10,
      hasMoreItems: true,
      perPage: 10,
      dataTable: [],
    };
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    this.getDataTableMonitor();
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

  getLoad = async addressLedger => {
    let karma = 0;
    let sumKarma = 0;
    let load = 0;

    const responseAccountBandwidth = await getAccountBandwidth(addressLedger);
    const responseIndexStats = await getIndexStats();

    if (responseAccountBandwidth !== null && responseIndexStats !== null) {
      karma = responseAccountBandwidth.karma;
      sumKarma = responseIndexStats.totalKarma;
      load = parseFloat(karma) / parseFloat(sumKarma);
      console.log('load', load);
    }
    return load;
  };

  // {Math.floor(
  //   (cybWon / DISTRIBUTION.takeoff) * DISTRIBUTION[key]
  // )}
  getDataTableMonitor = async () => {
    const { won, addressLedger } = this.state;
    const dataTable = [];

    Object.keys(DISTRIBUTION).forEach(async key => {
      let discipline = '';
      let maxPrize = 0;
      let currentPrize = 0;
      let cybWonAbsolute = 0;
      const cybWonPercent = 0;
      let response = null;

      if (key !== 'takeoff') {
        discipline = key;
        maxPrize = DISTRIBUTION[key];
        currentPrize = (won / DISTRIBUTION.takeoff) * maxPrize;

        switch (key) {
          case 'load':
            response = await this.getLoad(addressLedger.bech32);
            cybWonAbsolute = response * currentPrize;
            break;
          default:
            break;
        }

        dataTable.push({
          discipline,
          maxPrize,
          currentPrize,
          cybWonAbsolute,
          cybWonPercent,
        });
      }
    });
    this.setState({ dataTable });
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
      won,
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
      won,
      dataTable,
    } = this.state;

    console.log('dataTable', dataTable);

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
                            (won / DISTRIBUTION.takeoff) * DISTRIBUTION[key]
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
            <Indicators title="My GOLs" value="∞" />
            <Indicators title="My EULs" value="∞" />
            <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title="Max prize fund"
              value="100 TCYB"
            />
            <Indicators title="Current prize fund" value="12 TCYB" />
            <Indicators
              title="Takeoff donations"
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
