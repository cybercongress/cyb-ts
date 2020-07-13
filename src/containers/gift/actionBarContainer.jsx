import React from 'react';
import { Text, Pane, Button, ActionBar } from '@cybercongress/gravity';
import { withRouter, Redirect } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { CosmosDelegateTool } from '../../utils/ledger';

import { i18n } from '../../i18n/en';

import { CYBER, LEDGER, AUCTION, COSMOS, TAKEOFF } from '../../utils/config';

import { ConnectLadger } from '../../components';

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
      toRedirect: null,
      redirect: false,
    };
    this.routeChange = this.routeChange.bind(this);
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

  routeChange = newPath => {
    const { history } = this.props;
    const path = newPath;
    history.push(path);
  };

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
      const accounts = {};

      const addressLedgerCyber = await ledger.retrieveAddressCyber(HDPATH);
      const addressLedgerCosmos = await ledger.retrieveAddress(HDPATH);

      accounts.cyber = addressLedgerCyber;
      accounts.cosmos = addressLedgerCosmos;

      console.log('address', addressLedgerCyber);

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));
      this.setState({
        stage: STAGE_READY,
        toRedirect: '/pocket',
        redirect: true,
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

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      ledger: null,
      returnCode: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      toRedirect: null,
      redirect: false,
    });
  };

  onClickGetAddressLedger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  onClickPlay = () => {
    this.routeChange('/gol');
  };

  render() {
    const { addAddress } = this.props;
    const {
      stage,
      returnCode,
      ledgerVersion,
      redirect,
      toRedirect,
    } = this.state;

    if (redirect) {
      this.routeChange(toRedirect);
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

    return (
      <ActionBar>
        <Pane>
          {addAddress && (
            <Pane>
              You can safely claim bootstrap fuel by connecting the Ledger
              <Button
                marginLeft={10}
                onClick={() => this.onClickGetAddressLedger()}
              >
                Connect
              </Button>
            </Pane>
          )}
          {!addAddress && (
            <Pane>
              Amazing, you can join Game of Links now{' '}
              <Button marginLeft={10} onClick={this.onClickPlay}>
                Play
              </Button>
            </Pane>
          )}
        </Pane>
      </ActionBar>
    );
  }
}

export default withRouter(ActionBarContainer);
