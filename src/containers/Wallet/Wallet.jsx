import React from 'react';
import { Pane, Text, TableEv as Table, Battery } from '@cybercongress/gravity';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import { CosmosDelegateTool } from '../../utils/ledger';
import { FormatNumber, Loading, ConnectLadger, Copy } from '../../components';
import withWeb3 from '../../components/web3/withWeb3';
import NotFound from '../application/notFound';
import {
  formatNumber,
  getDecimal,
  trimString,
  formatCurrency,
} from '../../utils/utils';
import ActionBarContainer from './actionBarContainer';

import {
  CYBER,
  LEDGER,
  COSMOS,
  PATTERN_COSMOS,
  PATTERN_CYBER,
} from '../../utils/config';
import { i18n } from '../../i18n/en';
import {
  getBalance,
  getTotalEUL,
  getAccountBandwidth,
  getCurrentBandwidthPrice,
  getParamBandwidth,
} from '../../utils/search/utils';

const { CYBER_NODE_URL, DIVISOR_CYBER_G, DENOM_CYBER_G } = CYBER;

const T = new LocalizedStrings(i18n);

const {
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  LEDGER_VERSION_REQ,
} = LEDGER;

const imgLedger = require('../../image/ledger.svg');

const Row = ({ title, value, marginBottomValue, fontSizeValue, ...props }) => (
  <Pane
    width="100%"
    display="flex"
    flexDirection="column"
    alignItems="center"
    {...props}
  >
    <Pane fontSize={fontSizeValue} marginBottom={marginBottomValue}>
      {value}
    </Pane>
    <Pane>{title}</Pane>
  </Pane>
);

const ContentTooltip = ({ bwRemained, bwMaxValue, linkPrice }) => (
  <Pane
    minWidth={200}
    paddingX={18}
    paddingY={14}
    borderRadius={4}
    backgroundColor="#fff"
  >
    <Pane marginBottom={12}>
      <Text size={300}>
        You have {bwRemained} BP out of {bwMaxValue} BP.
      </Text>
    </Pane>
    <Pane marginBottom={12}>
      <Text size={300}>
        Full regeneration of bandwidth points or BP happens in 24 hours.
      </Text>
    </Pane>
    <Pane display="flex" marginBottom={12}>
      <Text size={300}>Current rate for 1 cyberlink is {linkPrice} BP.</Text>
    </Pane>
  </Pane>
);

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      pocket: [],
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      addAddress: false,
      loading: true,
      accounts: null,
      linkPrice: 0,
    };
  }

  async componentDidMount() {
    await this.getLinkPrice();
    await this.checkAddressLocalStorage();
  }

  componentDidUpdate() {
    const {
      ledger,
      stage,
      returnCode,
      addressLedger,
      addressInfo,
    } = this.state;

    if (stage === STAGE_LEDGER_INIT) {
      if (ledger === null) {
        this.pollLedger();
      }
      if (ledger !== null) {
        switch (returnCode) {
          case LEDGER_OK:
            if (addressLedger === null) {
              this.getAddress();
            }
            if (addressLedger !== null && addressInfo === null) {
              this.getAddressInfo();
            }
            break;
          default:
            console.log('getVersion');
            this.getVersion();
            break;
        }
      } else {
        // eslint-disable-next-line
        console.warn('Still looking for a Ledger device.');
      }
    }
  }

  getLinkPrice = async () => {
    let linkMsgCost = 0;
    let txCost = 0;
    let currentBandwidthPrice = 0;
    let linkPrice = 0;

    const dataParamBandwidth = await getParamBandwidth();
    if (dataParamBandwidth !== null) {
      linkMsgCost = dataParamBandwidth.link_msg_cost;
      txCost = dataParamBandwidth.tx_cost;
    }
    const dataCurrentBandwidthPrice = await getCurrentBandwidthPrice();
    if (dataCurrentBandwidthPrice !== null) {
      currentBandwidthPrice = dataCurrentBandwidthPrice;
    }

    linkPrice =
      (parseFloat(linkMsgCost) + parseFloat(txCost)) *
      parseFloat(currentBandwidthPrice);

    this.setState({
      linkPrice,
    });
  };

  compareVersion = async () => {
    const test = this.state.ledgerVersion;
    const target = LEDGER_VERSION_REQ;
    const testInt = 10000 * test[0] + 100 * test[1] + test[2];
    const targetInt = 10000 * target[0] + 100 * target[1] + target[2];
    return testInt >= targetInt;
  };

  checkAddressLocalStorage = async () => {
    let address = [];

    const localStorageStory = await localStorage.getItem('pocket');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ accounts: address });
      this.getAddressInfo();
    } else {
      this.setState({
        addAddress: true,
        loading: false,
      });
    }
  };

  pollLedger = async () => {
    const transport = await TransportU2F.create();
    this.setState({ ledger: new CosmosDelegateTool(transport) });
  };

  getVersion = async () => {
    const { ledger, returnCode } = this.state;
    try {
      const connect = await ledger.connect();
      if (returnCode === null || connect.return_code !== returnCode) {
        this.setState({
          address: null,
          returnCode: connect.return_code,
          ledgerVersion: [connect.major, connect.minor, connect.patch],
          errorMessage: null,
        });
        // eslint-disable-next-line

        console.warn('Ledger app return_code', this.state.returnCode);
      } else {
        this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
      }
    } catch ({ message, statusCode }) {
      // eslint-disable-next-line
      // eslint-disable-next-line
      console.error('Problem with Ledger communication', message, statusCode);
    }
  };

  getAddress = async () => {
    try {
      const { ledger } = this.state;
      const accounts = {};

      const addressLedgerCyber = await ledger.retrieveAddressCyber(HDPATH);
      const addressLedgerCosmos = await ledger.retrieveAddress(HDPATH);

      accounts.cyber = addressLedgerCyber;
      accounts.cosmos = addressLedgerCosmos;

      console.log('address', addressLedgerCyber);

      this.setState({
        addressLedger: addressLedgerCyber,
        accounts,
      });

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
      this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    }
  };

  getAddressInfo = async () => {
    const { accounts } = this.state;
    const pocket = {};
    const addressInfo = {
      address: '',
      amount: '',
      token: '',
      keys: '',
    };
    const responseCyber = await getBalance(accounts.cyber.bech32);
    const bandwidth = await getAccountBandwidth(accounts.cyber.bech32);
    const responseCosmos = await getBalance(
      accounts.cosmos.bech32,
      COSMOS.GAIA_NODE_URL_LSD
    );

    const totalCyber = await getTotalEUL(responseCyber);
    pocket.cyber = {
      address: accounts.cyber.bech32,
      amount: totalCyber.total,
      token: 'eul',
      bandwidth,
    };
    const totalCosmos = await getTotalEUL(responseCosmos);
    pocket.cosmos = {
      address: accounts.cosmos.bech32,
      amount: totalCosmos.total / COSMOS.DIVISOR_ATOM,
      token: 'atom',
      keys: 'ledger',
    };

    pocket.pk = accounts.cyber.pk;

    console.log(pocket);

    this.setState({
      pocket,
      stage: STAGE_READY,
      addAddress: false,
      loading: false,
      addressInfo,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      table: [],
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      addAddress: true,
    });
  };

  onClickGetAddressLedger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  render() {
    const {
      pocket,
      addressLedger,
      loading,
      addAddress,
      stage,
      returnCode,
      ledgerVersion,
      accounts,
      linkPrice,
    } = this.state;

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

    if (addAddress && stage === STAGE_INIT) {
      return (
        <div>
          <main className="block-body-home">
            <NotFound text={T.pocket.hurry} />
          </main>
          <ActionBarContainer
            // address={addressLedger.bech32}
            onClickAddressLedger={this.onClickGetAddressLedger}
            addAddress={addAddress}
          />
        </div>
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={this.cleatState}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(ledgerVersion, LEDGER_VERSION_REQ)
          }
        />
      );
    }

    if (!addAddress) {
      return (
        <div>
          <main
            style={{ minHeight: 'calc(100vh - 162px)' }}
            className="block-body-home"
          >
            <Pane
              boxShadow="0px 0px 5px #36d6ae"
              paddingX={20}
              paddingY={20}
              marginY={20}
            >
              <Text fontSize="16px" color="#fff">
                You do not have control over the brain. You need EUL tokens to
                let she hear you. If you came from Ethereum or Cosmos you can
                claim the gift of gods. Then start prepare to the greatest
                tournament in universe: <a href="gol">Game of Links</a>.
              </Text>
            </Pane>
            <Pane
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-around"
            >
              <Pane
                display="flex"
                flexDirection="column"
                className="container-card"
                paddingX={10}
                paddingTop={15}
                paddingBottom={40}
                height="300px"
              >
                <Pane flex={1}>
                  <Row
                    marginBottom={25}
                    fontSizeValue="18px"
                    value={
                      <Pane display="flex" alignItems="center">
                        <img
                          style={{ width: 20, height: 20, marginRight: 5 }}
                          src={imgLedger}
                          alt="ledger"
                        />
                        <div>{trimString(pocket.pk, 6, 6)}</div>
                      </Pane>
                    }
                    title="pubkey"
                  />
                  <Row
                    marginBottom={20}
                    marginBottomValue={5}
                    value={
                      <Pane display="flex" alignItems="center">
                        <Link
                          to={`/network/euler-5/contract/${pocket.cyber.address}`}
                        >
                          <div>{trimString(pocket.cyber.address, 11, 6)}</div>
                        </Link>
                        <Copy text={pocket.cyber.address} />
                      </Pane>
                    }
                    title={formatCurrency(
                      pocket.cyber.amount,
                      pocket.cyber.token
                    )}
                  />
                  <Row
                    marginBottom={20}
                    marginBottomValue={5}
                    value={
                      <Pane display="flex" alignItems="center">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://www.mintscan.io/account/${pocket.cosmos.address}`}
                        >
                          <div>{trimString(pocket.cosmos.address, 12, 6)}</div>
                        </a>
                        <Copy text={pocket.cosmos.address} />
                      </Pane>
                    }
                    title={
                      <div>
                        {pocket.cosmos.amount.toPrecision(2)}{' '}
                        {pocket.cosmos.token}
                      </div>
                    }
                  />
                </Pane>

                <Pane width="80%">
                  <Battery
                    bwPercent={trimString(
                      (
                        (parseFloat(pocket.cyber.bandwidth.remained) /
                          parseFloat(pocket.cyber.bandwidth.max_value)) *
                        100
                      ).toPrecision(2)
                    )}
                    contentTooltip={
                      <ContentTooltip
                        bwRemained={pocket.cyber.bandwidth.remained}
                        bwMaxValue={pocket.cyber.bandwidth.max_value}
                        linkPrice={linkPrice}
                      />
                    }
                  />
                </Pane>
              </Pane>
            </Pane>
          </main>
          <ActionBarContainer
            addressTable={accounts.cyber.bech32}
            onClickAddressLedger={this.onClickGetAddressLedger}
            addAddress={addAddress}
            updateAddress={this.checkAddressLocalStorage}
            // onClickSend={}
          />
        </div>
      );
    }
    return null;
  }
}

export default Wallet;
