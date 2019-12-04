import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { CosmosDelegateTool } from '../../utils/ledger';
import { FormatNumber, Loading } from '../../components';
import withWeb3 from '../../components/web3/withWeb3';
import NotFound from '../application/notFound';
// import { formatNumber } from '../../utils/search/utils';
import ActionBarContainer from './actionBarContainer';

import { SendAmounLadger } from './actionBarStage';

import { indexedNode } from '../../utils/config';

const HDPATH = [44, 118, 0, 0, 0];

const TIMEOUT = 5000;

const LEDGER_OK = 36864;
const LEDGER_NOAPP = 28160;

const STAGE_INIT = 0;
const STAGE_LEDGER_INIT = 1;
const STAGE_READY = 2;

const LEDGER_VERSION_REQ = [1, 1, 1];

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

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

    const localStorageStory = await localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLedger: address });
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

      const addressLedger = await ledger.retrieveAddressCyber(HDPATH);

      console.log('address', addressLedger);

      this.setState({
        addressLedger,
      });

      localStorage.setItem('ledger', JSON.stringify(addressLedger));
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
    const { addressLedger } = this.state;
    const table = [];
    const addressInfo = {
      address: '',
      amount: '',
      token: '',
      keys: '',
    };
    const response = await fetch(
      `${indexedNode}/api/account?address="${addressLedger.bech32}"`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();

    console.log('data', data);

    addressInfo.address = addressLedger.bech32;
    addressInfo.amount = data.result.account.coins[0].amount;
    addressInfo.token = data.result.account.coins[0].denom;
    addressInfo.keys = 'ledger';

    table.push(addressInfo);

    this.setState({
      table,
      stage: STAGE_READY,
      addAddress: false,
      loading: false,
      addressInfo,
    });
  };

  getAmount = async address => {
    try {
      const response = await fetch(
        `${indexedNode}/api/account?address="${address}"`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data.result;
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
      // this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    }
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
    } = this.state;
// console.log(addressLedger);
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
            <a
              target="_blank"
              href={`https://cyberd.ai/account/${item.address}`}
            >
              {item.address}
            </a>
          </Text>
        </Table.TextCell>
        <Table.TextCell flex={0.5}>
          <Text color="#fff" fontSize="17px">
            <FormatNumber number={item.amount} />
          </Text>
        </Table.TextCell>
        <Table.TextCell flex={0.2}>
          <Text color="#fff" fontSize="17px">
            {item.token}
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
            <NotFound text="Hurry up! Find and connect your secure Ledger" />
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
        <SendAmounLadger
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
                      Address
                    </Text>
                  </Table.TextHeaderCell>
                  <Table.TextHeaderCell flex={0.5}>
                    <Text color="#fff" fontSize="17px">
                      Amount
                    </Text>
                  </Table.TextHeaderCell>
                  <Table.TextHeaderCell flex={0.2}>
                    <Text color="#fff" fontSize="17px">
                      Token
                    </Text>
                  </Table.TextHeaderCell>
                  <Table.TextHeaderCell flex={0.3}>
                    <Text color="#fff" fontSize="17px">
                      Keys
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
            addressTable={addressLedger.bech32}
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
