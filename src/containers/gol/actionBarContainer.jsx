import React from 'react';
import { Text, Pane, Button, ActionBar } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { CosmosDelegateTool } from '../../utils/ledger';

import { i18n } from '../../i18n/en';

import { CYBER, LEDGER, AUCTION, COSMOS, TAKEOFF } from '../../utils/config';

import { ConnectLadger } from '../../components';

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

class ActionBarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      ledger: null,
      returnCode: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
    };
  }

  componentDidUpdate() {
    const { ledger, stage, returnCode, addressLedger } = this.state;

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
      this.setState({
        ledger: null,
      });
      console.error('Problem with Ledger communication', message, statusCode);
    }
  };

  getAddress = async () => {
    try {
      const { ledger } = this.state;
      const { updateFunc } = this.props;
      const accounts = {};

      const addressLedgerCyber = await ledger.retrieveAddressCyber(HDPATH);
      const addressLedgerCosmos = await ledger.retrieveAddress(HDPATH);

      accounts.cyber = addressLedgerCyber;
      accounts.cosmos = addressLedgerCosmos;

      console.log('address', addressLedgerCyber);

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));
      updateFunc();
      this.setState({
        addressLedger: addressLedgerCyber,
        stage: STAGE_READY,
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

  onClickGetAddressLedger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  render() {
    const { addAddress, cleatState } = this.props;
    const { stage, returnCode, ledgerVersion } = this.state;

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={cleatState}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(ledgerVersion, LEDGER_VERSION_REQ)
          }
        />
      );
    }

    return (
      <ActionBar>
        <Pane width="100%">
          {addAddress && (
            <Pane
              display="flex"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color="#fff"
                // display="flex"
                // alignItems="center"
                textAlign="center"
                flex={1}
                fontSize="18px"
              >
                You can track your progress
              </Text>
              <Button
                paddingX={20}
                onClick={() => this.onClickGetAddressLedger()}
              >
                {T.actionBar.pocket.put}
              </Button>
            </Pane>
          )}
          {!addAddress && (
            <Pane
              display="flex"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color="#fff"
                // display="flex"
                // alignItems="center"
                textAlign="center"
                flex={1}
                fontSize="18px"
              >
                Choose you path
              </Text>
              <a
                style={{
                  fontSize: '18px',
                  padding: '10px 30px',
                  minWidth: '120px',
                  textAlign: 'center',
                }}
                className="bnt-claime"
                href=""
              >
                Master
              </a>
              <Link
                style={{
                  fontSize: '18px',
                  margin: '0 10px',
                  padding: '10px 30px',
                  minWidth: '120px',
                  textAlign: 'center',
                }}
                className="bnt-claime"
                to="/heroes"
              >
                Hero
              </Link>
              <a
                style={{
                  fontSize: '18px',
                  padding: '10px 30px',
                  minWidth: '120px',
                  textAlign: 'center',
                }}
                className="bnt-claime"
                href=""
              >
                Evangelist
              </a>
            </Pane>
          )}
        </Pane>
      </ActionBar>
    );
  }
}

export default ActionBarContainer;
