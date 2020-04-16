import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import { CosmosDelegateTool } from '../../utils/ledger';
import { FormatNumber, Loading, ConnectLadger } from '../../components';
import withWeb3 from '../../components/web3/withWeb3';
import NotFound from '../application/notFound';
import { formatNumber, getDecimal } from '../../utils/utils';
import ActionBarContainer from './actionBarContainer';

import {
  CYBER,
  LEDGER,
  COSMOS,
  PATTERN_COSMOS,
  PATTERN_CYBER,
} from '../../utils/config';
import { i18n } from '../../i18n/en';
import { getBalance, getTotalEUL } from '../../utils/search/utils';

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

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      table: [],
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      addAddress: false,
      loading: true,
      accounts: null,
    };
  }

  async componentDidMount() {
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
    const table = [];
    const addressInfo = {
      address: '',
      amount: '',
      token: '',
      keys: '',
    };
    const responseCyber = await getBalance(accounts.cyber.bech32);
    const responseCosmos = await getBalance(
      accounts.cosmos.bech32,
      COSMOS.GAIA_NODE_URL_LSD
    );

    const totalCyber = await getTotalEUL(responseCyber);
    table.push({
      address: accounts.cyber.bech32,
      amount: totalCyber.total,
      token: 'eul',
      keys: 'ledger',
    });
    const totalCosmos = await getTotalEUL(responseCosmos);
    table.push({
      address: accounts.cosmos.bech32,
      amount: totalCosmos.total / COSMOS.DIVISOR_ATOM,
      token: 'atom',
      keys: 'ledger',
    });

    console.log(table);

    this.setState({
      table,
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
      table,
      addressLedger,
      loading,
      addAddress,
      stage,
      returnCode,
      ledgerVersion,
      accounts,
    } = this.state;

    const rowsTable = table.map(item => (
      <Table.Row
        borderBottom="none"
        paddingLeft={20}
        height={50}
        isSelectable
        key={item.address}
      >
        <Table.TextCell flex={1.3}>
          <Text color="#fff" fontSize="17px">
            {item.address.match(PATTERN_CYBER) && (
              <Link to={`/network/euler/contract/${item.address}`}>
                {item.address}
              </Link>
            )}
            {item.address.match(PATTERN_COSMOS) && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.mintscan.io/account/${item.address}`}
              >
                {item.address}
              </a>
            )}
          </Text>
        </Table.TextCell>
        <Table.TextCell textAlign="end" flex={0.5}>
          <Text color="#fff" fontSize="17px">
            <span>{formatNumber(Math.floor(parseFloat(item.amount)))}</span>
            <span
              style={{
                display: 'inline-block',
                textAlign: 'left',
                width: '40px',
              }}
            >
              {Math.floor(item.amount) > 0
                ? ''
                : `,${getDecimal(formatNumber(item.amount, 3))}`}
            </span>
          </Text>
        </Table.TextCell>
        <Table.TextCell textAlign="center" flex={0.2}>
          <Text color="#fff" fontSize="17px">
            {item.token.toUpperCase()}
          </Text>
        </Table.TextCell>
        <Table.TextCell flex={0.3}>
          <Text color="#fff" fontSize="17px">
            {item.keys}
          </Text>
        </Table.TextCell>
      </Table.Row>
    ));

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
          <main className="block-body-home">
            <Pane
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-around"
            >
              <Table width="100%">
                <Table.Head
                  style={{
                    backgroundColor: '#000',
                    borderBottom: '1px solid #ffffff80',
                  }}
                  paddingLeft={20}
                >
                  <Table.TextHeaderCell flex={1.3}>
                    <Text color="#fff" fontSize="17px">
                      {T.pocket.table.address}
                    </Text>
                  </Table.TextHeaderCell>
                  <Table.TextHeaderCell flex={0.5}>
                    <Text color="#fff" fontSize="17px">
                      {T.pocket.table.amount}
                    </Text>
                  </Table.TextHeaderCell>
                  <Table.TextHeaderCell flex={0.2}>
                    <Text color="#fff" fontSize="17px">
                      {T.pocket.table.token}
                    </Text>
                  </Table.TextHeaderCell>
                  <Table.TextHeaderCell flex={0.3}>
                    <Text color="#fff" fontSize="17px">
                      {T.pocket.table.keys}
                    </Text>
                  </Table.TextHeaderCell>
                </Table.Head>
                <Table.Body
                  style={{ backgroundColor: '#000', overflowY: 'hidden' }}
                >
                  {rowsTable}
                </Table.Body>
              </Table>
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
