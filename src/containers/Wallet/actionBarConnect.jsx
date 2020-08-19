import React, { Component } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link } from 'react-router-dom';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import { ConnectLadger, Dots } from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_CYBER,
  POCKET,
} from '../../utils/config';
import { fromBech32 } from '../../utils/utils';

const imgLedger = require('../../image/ledger.svg');

const { DIVISOR_CYBER_G } = CYBER;

const { STAGE_INIT, STAGE_LEDGER_INIT, HDPATH, LEDGER_OK } = LEDGER;

const STAGE_ADD_ADDRESS_LEDGER = 1.1;
const STAGE_ADD_ADDRESS_USER = 2.1;
const STAGE_ADD_ADDRESS_OK = 2.2;
const LEDGER_TX_ACOUNT_INFO = 2.5;

class ActionBarConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      connectLedger: null,
      valueInputAddres: '',
    };
    this.timeOut = null;
    this.ledger = null;
    this.transport = null;
  }

  // async componentDidMount() {
  //   this.pollLedger();
  // }

  componentDidUpdate() {
    const { addAddress } = this.props;
    const { stage } = this.state;

    if (addAddress === false && stage === STAGE_ADD_ADDRESS_OK) {
      this.cleatState();
    }
  }

  getLedgerAddress = async () => {
    const { stage } = this.state;
    this.transport = await TransportWebUSB.create(120 * 1000);
    this.ledger = new CosmosDelegateTool(this.transport);

    const connect = await this.ledger.connect();
    if (connect.return_code === LEDGER_OK) {
      if (stage === STAGE_ADD_ADDRESS_LEDGER) {
        this.addAddressLedger();
      }
      this.setState({
        connectLedger: true,
      });
    } else {
      this.setState({
        connectLedger: false,
      });
    }
  };

  addAddressLedger = async () => {
    try {
      const { updateAddress } = this.props;
      const accounts = {};

      const addressLedgerCyber = await this.ledger.retrieveAddressCyber(HDPATH);
      const addressLedgerCosmos = await this.ledger.retrieveAddress(HDPATH);

      accounts.cyber = addressLedgerCyber;
      accounts.cosmos = addressLedgerCosmos;
      accounts.keys = 'ledger';

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));

      if (updateAddress) {
        updateAddress();
      }
      this.setState({
        stage: STAGE_ADD_ADDRESS_OK,
      });
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

  onClickInitLedger = async () => {
    await this.setState({
      stage: STAGE_LEDGER_INIT,
    });
    this.getLedgerAddress();
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      valueInputAddres: '',
    });
    this.timeOut = null;
    this.ledger = null;
    this.transport = null;
  };

  onClickAddAddressLedger = async () => {
    await this.setState({
      stage: STAGE_ADD_ADDRESS_LEDGER,
    });
    this.getLedgerAddress();
  };

  onClickAddAddressUser = () => {
    this.setState({
      stage: STAGE_ADD_ADDRESS_USER,
    });
  };

  onChangeInputAddress = e => {
    this.setState({
      valueInputAddres: e.target.value,
    });
  };

  onClickAddAddressUserToLocalStr = () => {
    const { valueInputAddres } = this.state;
    const { updateAddress } = this.props;
    const accounts = {
      cyber: {
        bech32: '',
      },
      cosmos: {
        bech32: '',
      },
    };
    const addressLedgerCyber = {
      bech32: '',
    };

    if (valueInputAddres.match(PATTERN_COSMOS)) {
      const cyberAddress = fromBech32(
        valueInputAddres,
        CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
      );
      accounts.cyber.bech32 = cyberAddress;
      addressLedgerCyber.bech32 = cyberAddress;
      accounts.cosmos.bech32 = valueInputAddres;
      accounts.keys = 'user';

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));

      this.setState({
        stage: STAGE_ADD_ADDRESS_OK,
      });
    }

    if (valueInputAddres.match(PATTERN_CYBER)) {
      const cosmosAddress = fromBech32(valueInputAddres, 'cosmos');
      accounts.cyber.bech32 = valueInputAddres;
      addressLedgerCyber.bech32 = valueInputAddres;
      accounts.cosmos.bech32 = cosmosAddress;
      accounts.keys = 'user';

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));

      this.setState({
        stage: STAGE_ADD_ADDRESS_OK,
      });
    }

    if (updateAddress) {
      updateAddress();
    }
  };

  connectKeplr = async () => {
    const { keplr, updateAddress } = this.props;
    const accounts = {
      cyber: {
        bech32: '',
      },
      cosmos: {
        bech32: '',
      },
      keys: 'keplr',
      pk: [],
    };

    await keplr.enable();

    const address = await keplr.getKeys();
    const cosmosAddress = fromBech32(address[0].bech32Address, 'cosmos');
    accounts.cyber.bech32 = address[0].bech32Address;
    accounts.cosmos.bech32 = cosmosAddress;
    accounts.pk = address[0].pubKey;
    localStorage.setItem('pocket', JSON.stringify(accounts));

    this.setState({
      stage: STAGE_ADD_ADDRESS_OK,
    });

    if (updateAddress) {
      updateAddress();
    }
  };

  render() {
    const { keplr, accountKeplr } = this.props;
    const { stage, connectLedger, valueInputAddres } = this.state;

    console.log('keplr', keplr);
    console.log('accountKeplr :>> ', accountKeplr);

    if (stage === STAGE_INIT) {
      return (
        <ActionBar>
          <Pane>
            <Button marginX="10px" onClick={this.onClickAddAddressUser}>
              Put a read-only address
            </Button>
            <Button marginX="10px" onClick={this.onClickAddAddressLedger}>
              Pocket your Ledger
            </Button>
            {keplr && (
              <Button marginX="10px" onClick={this.connectKeplr}>
                Connect Keplr
              </Button>
            )}
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_ADD_ADDRESS_USER) {
      return (
        <ActionBar>
          <Pane
            flex={1}
            justifyContent="center"
            alignItems="center"
            fontSize="18px"
            display="flex"
          >
            put cosmos or cyber address:
            <input
              value={valueInputAddres}
              style={{
                height: '42px',
                maxWidth: '200px',
                marginLeft: '10px',
                textAlign: 'end',
              }}
              onChange={this.onChangeInputAddress}
              placeholder="address"
              autoFocus
            />
          </Pane>

          <Button
            disabled={
              !valueInputAddres.match(PATTERN_COSMOS) &&
              !valueInputAddres.match(PATTERN_CYBER)
            }
            onClick={this.onClickAddAddressUserToLocalStr}
          >
            Add address
          </Button>
        </ActionBar>
      );
    }

    if (stage === STAGE_ADD_ADDRESS_OK) {
      return (
        <ActionBar>
          <Pane display="flex" alignItems="center">
            <Pane fontSize={20}>adding address</Pane>
            <Dots big />
          </Pane>
        </ActionBar>
      );
    }

    if (stage === STAGE_LEDGER_INIT || stage === STAGE_ADD_ADDRESS_LEDGER) {
      return (
        <ConnectLadger
          onClickConnect={() => this.getLedgerAddress()}
          connectLedger={connectLedger}
        />
      );
    }

    return null;
  }
}

export default ActionBarConnect;
