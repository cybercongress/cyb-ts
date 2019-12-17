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
import { CosmosDelegateTool } from '../../utils/ledger';
import withWeb3 from '../../components/web3/withWeb3';
import {
  formatNumber,
  getStatistics,
  getValidators,
  statusNode,
  getRelevance,
  getRankGrade,
} from '../../utils/search/utils';
import { roundNumber, asyncForEach } from '../../utils/utils';
import {
  CardStatisics,
  ConnectLadger,
  Loading,
  FormatNumber,
} from '../../components';
import Dinamics from './diagram';
import { cybWon } from '../../utils/fundingMath';

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
      selected: 'disciplines',
      loading: true,
      chainId: '',
      amount: 0,
      supplyEUL: 0,
      takeofPrice: 0,
      capATOM: 0,
      averagePrice: 0,
      capETH: 0,
      topLink: [],
    };
  }

  async componentDidMount() {
    this.getRelevance();
  }

  getRelevance = async () => {
    const data = await getRelevance();

    const topLink = data.cids;

    this.setState({
      topLink,
      loading: false,
    });
  };

  select = selected => {
    this.setState({ selected });
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

  render() {
    const {
      linksCount,
      cidsCount,
      accsCount,
      txCount,
      blockNumber,
      linkPrice,
      totalCyb,
      stakedCyb,
      activeValidatorsCount,
      stage,
      returnCode,
      ledgerVersion,
      addAddress,
      amount,
      loading,
      chainId,
      averagePrice,
      capETH,
      supplyEUL,
      takeofPrice,
      capATOM,
      selected,
      topLink,
    } = this.state;

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

    const topLinkItems = [];
    if (topLink.length > 0) {
      const resultsLimit = 10;
      for (let index = 0; index < resultsLimit; index += 1) {
        const item = (
          <SearchItem
            key={topLink[index].cid}
            hash={topLink[index].cid}
            rank={topLink[index].rank}
            grade={getRankGrade(topLink[index].rank)}
            status="success"
          >
            {topLink[index].cid}
          </SearchItem>
        );

        topLinkItems.push(item);
      }
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

    const Main = () => (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
        width="100%"
      >
        <CardStatisics
          title={T.brain.cyberlinks}
          value={formatNumber(linksCount)}
        />
        <CardStatisics title={T.brain.cap} value={formatNumber(cidsCount)} />
        <a
          href="/#/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            title={T.brain.heroes}
            value={activeValidatorsCount}
            icon={<Icon icon="arrow-right" color="#4caf50" marginLeft={5} />}
          />
        </a>
      </Pane>
    );

    const Relevance = () => <Pane width="100%">{topLinkItems}</Pane>;

    if (selected === 'delegation') {
      content = <Main />;
    }

    if (selected === 'load') {
      content = <Main />;
    }

    if (selected === 'relevance') {
      content = <Relevance />;
    }

    if (selected === 'disciplines') {
      content = (
        <Pane width="100%">
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
                  Group
                </Text>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell textAlign="center">
                <Text fontSize="18px" color="#fff">
                  Amount of EUL
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
              {DISTRIBUTION.map(item => (
                <Table.Row borderBottom="none">
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

    // if (selected === 'uptime') {
    //   content = <CybernomicsEUL />;
    // }

    // if (selected === 'FVS') {
    //   content = <Consensus />;
    // }

    // if (selected === 'euler4') {
    //   content = <Bandwidth />;
    // }

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
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gridGap="20px"
            width="100%"
            marginY={50}
          >
            <CardStatisics
              title={T.gol.myGOLs}
              value={formatNumber(linksCount)}
            />
            <CardStatisics
              title={T.gol.myEULs}
              value={formatNumber(cidsCount)}
            />
            <CardStatisics title={T.gol.maxPrize} value="100 TCYB" />
            <CardStatisics
              title={T.gol.currentPrize}
              value={formatNumber(cidsCount)}
            />
            <CardStatisics
              title={T.gol.takeoff}
              value={formatNumber(cidsCount)}
            />
          </Pane>
          <Tablist
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gridGap="20px"
            marginTop={25}
          >
            <TabBtn
              text="Delegation"
              isSelected={selected === 'delegation'}
              onSelect={() => this.select('delegation')}
            />
            <TabBtn
              text="Load"
              isSelected={selected === 'load'}
              onSelect={() => this.select('load')}
            />
            <TabBtn
              text="Relevance"
              isSelected={selected === 'relevance'}
              onSelect={() => this.select('relevance')}
            />
            <TabBtn
              text="Disciplines"
              isSelected={selected === 'disciplines'}
              onSelect={() => this.select('disciplines')}
            />
            <TabBtn
              text="Uptime"
              isSelected={selected === 'uptime'}
              onSelect={() => this.select('uptime')}
            />
            <TabBtn
              text="FVS"
              isSelected={selected === 'FVS'}
              onSelect={() => this.select('FVS')}
            />
            <TabBtn
              text="Euler-4"
              isSelected={selected === 'euler4'}
              onSelect={() => this.select('euler4')}
            />
            <TabBtn
              text="Community pool"
              isSelected={selected === 'communityPool'}
              onSelect={() => this.select('communityPool')}
            />
          </Tablist>
          <Pane
            display="flex"
            marginTop={50}
            marginBottom={50}
            justifyContent="center"
          >
            {content}
          </Pane>
        </main>
        <ActionBarContainer
          addAddress={addAddress}
          cleatState={this.cleatState}
          updateFunc={this.checkAddressLocalStorage}
        />
      </div>
    );
  }
}

export default withWeb3(GOL);
