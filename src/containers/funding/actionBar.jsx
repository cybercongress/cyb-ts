import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Link } from 'react-router-dom';
import { Input, ActionBar, Pane, Text, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import { COSMOS, LEDGER, PATTERN_COSMOS, CYBER } from '../../utils/config';
import {
  getDelegator,
  downloadObjectAsJson,
  trimString,
  getTimeRemaining,
} from '../../utils/utils';
import {
  ContributeATOMs,
  SendAmount,
  ConnectLadger,
  JsonTransaction,
  Confirmed,
  TransactionSubmitted,
  TransactionError,
  ActionBarContentText,
  LinkWindow,
  CheckAddressInfo,
  Dots,
  Timer,
} from '../../components';

const {
  STAGE_INIT,
  STAGE_SELECTION,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
  LEDGER_VERSION_REQ,
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  MEMO,
} = LEDGER;

const CUSTOM_TX_CONTROL_PK = 1.1;
const CUSTOM_TX_UNDERSTAND = 1.2;
const CUSTOM_TX_TRACK = 1.3;
const CUSTOM_TX_AGREE = 1.4;
const CUSTOM_TX_TYPE_TX = 1.5;

const LEDGER_TX_ACOUNT_INFO = 2.2;

const SELECT_PATH = 10;

const { ADDR_FUNDING, DEFAULT_GAS, DEFAULT_GAS_PRICE, DIVISOR_ATOM } = COSMOS;

const ledger = require('../../image/select-pin-nano2.svg');

class ActionBarTakeOff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      ledger: null,
      ledgerVersion: [0, 0, 0],
      returnCode: null,
      addressInfo: null,
      address: null,
      availableStake: 0,
      time: 0,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
      toSend: '',
      txBody: null,
      txContext: null,
      txHash: null,
      txHeight: null,
      height50: false,
      days: '00',
      hours: '00',
      seconds: '00',
      minutes: '00',
      time: true,
      trackAddress: '',
    };
    this.ledgerModal = React.createRef();
    this.atomField = React.createRef();
    this.gasField = React.createRef();
    this.gasPriceField = React.createRef();
    this.timeOut = null;
    this.haveDocument = typeof document !== 'undefined';
  }

  componentDidMount() {
    // eslint-disable-next-line
    console.warn('Looking for Ledger Nano');
    this.pollLedger();
    const deadline = `${COSMOS.TIME_START}`;
    console.log(Date.parse(deadline));
    const startTime = Date.parse(deadline) - Date.parse(new Date());
    if (startTime <= 0) {
      this.setState({
        time: false,
      });
    } else {
      this.initializeClock(deadline);
    }
  }

  componentDidUpdate() {
    const { ledger, returnCode, address, addressInfo, stage } = this.state;
    if (ledger === null) {
      this.pollLedger();
    }
    if (stage === STAGE_LEDGER_INIT) {
      if (ledger !== null) {
        switch (returnCode) {
          case LEDGER_OK:
            if (address === null) {
              this.getAddress();
            }
            if (address !== null && addressInfo === null) {
              console.log('getWallet');
              this.getWallet();
            }
            break;
          default:
            // console.log('getVersion');
            this.getVersion();
            break;
        }
      } else {
        // eslint-disable-next-line
        console.warn('Still looking for a Ledger device.');
      }
    }
  }

  initializeClock = endtime => {
    const { initClock } = this.props;
    let timeinterval;
    const updateClock = () => {
      const t = getTimeRemaining(endtime);
      if (t.total <= 0) {
        clearInterval(timeinterval);
        initClock();
        this.setState({
          time: false,
        });
        return true;
      }
      this.setState({
        days: t.days,
        hours: `0${t.hours}`.slice(-2),
        minutes: `0${t.minutes}`.slice(-2),
        seconds: `0${t.seconds}`.slice(-2),
      });
    };

    updateClock();
    timeinterval = setInterval(updateClock, 1000);
  };

  compareVersion = async () => {
    const { ledgerVersion } = this.state;
    const test = ledgerVersion;
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
        const { major, minor, patch } = connect;
        const ledgerVersion = [major, minor, patch];

        this.setState({
          txMsg: null,
          address: null,
          txBody: null,
          returnCode: connect.return_code,
          ledgerVersion,
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
    const { ledger } = this.state;
    try {
      const accounts = {};
      const address = await ledger.retrieveAddress(HDPATH);
      const addressLedgerCyber = await ledger.retrieveAddressCyber(HDPATH);

      accounts.cyber = addressLedgerCyber;
      accounts.cosmos = address;
      accounts.keys = 'ledger';

      console.log('address', addressLedgerCyber);

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));

      console.log('address', address);
      this.setState({
        address,
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

  getWallet = async () => {
    const { ledger, address } = this.state;
    this.setState({
      stage: LEDGER_TX_ACOUNT_INFO,
    });

    const addressInfo = await ledger.getAccountInfo(address);

    this.setState({
      addressInfo,
      availableStake: parseFloat(addressInfo.balanceuAtom),
      stage: STAGE_READY,
    });
  };

  createTxForCLI = async () => {
    const { ledger, trackAddress, toSend } = this.state;
    const addressTo = ADDR_FUNDING;
    const uatomAmount = toSend * DIVISOR_ATOM;

    const tx = await ledger.txCreateSend(
      null,
      addressTo,
      uatomAmount,
      MEMO,
      true,
      trackAddress
    );

    console.log('tx', tx);
    downloadObjectAsJson(tx, 'tx_send');
    this.setState({
      stage: SELECT_PATH,
    });
  };

  generateTx = async () => {
    const { ledger, address, addressInfo, toSend } = this.state;
    const validatorBech32 = ADDR_FUNDING;
    const uatomAmount = toSend * DIVISOR_ATOM;
    const txContext = {
      accountNumber: addressInfo.accountNumber,
      balanceuAtom: addressInfo.balanceuAtom,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };

    const tx = await ledger.txCreateSend(
      txContext,
      validatorBech32,
      uatomAmount,
      MEMO
    );

    console.log('tx', tx);
    await this.setState({
      txMsg: tx,
      txContext,
      txBody: null,
      error: null,
    });
    // debugger;
    this.signTx();
  };

  signTx = async () => {
    const { txMsg, ledger, txContext } = this.state;
    // console.log('txContext', txContext);
    this.setState({ stage: STAGE_WAIT });
    const sing = await ledger.sign(txMsg, txContext);
    console.log('sing', sing);
    if (sing.return_code === LEDGER.LEDGER_OK) {
      const applySignature = await ledger.applySignature(
        sing,
        txMsg,
        txContext
      );
      if (applySignature !== null) {
        this.setState({
          txMsg: null,
          txBody: applySignature,
          stage: STAGE_SUBMITTED,
        });
        await this.injectTx();
      }
    } else {
      this.setState({
        stage: STAGE_ERROR,
        txBody: null,
        errorMessage: sing.error_message,
      });
    }
  };

  injectTx = async () => {
    const { ledger, txBody } = this.state;
    const txSubmit = await ledger.txSubmit(txBody);
    const data = txSubmit;
    console.log('data', data);
    if (data.error) {
      // if timeout...
      // this.setState({stage: STAGE_CONFIRMING})
      // else
      this.setState({ stage: STAGE_ERROR, errorMessage: data.error });
    } else {
      this.setState({ stage: STAGE_SUBMITTED, txHash: data.data.txhash });
      this.timeOut = setTimeout(this.confirmTx, 1500);
    }
  };

  confirmTx = async () => {
    const { txHash, ledger } = this.state;
    const { update } = this.props;
    if (txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await ledger.txStatus(txHash);
      const data = await status;
      if (data.logs && data.logs[0].success === true) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });

        return;
      }
    }
    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  tryConnect = async () => {
    const { ledger } = this.state;
    const connect = await ledger.connect();
    return connect;
  };

  cleatState = () => {
    const { update } = this.props;
    this.setState({
      ledger: null,
      ledgerVersion: [0, 0, 0],
      returnCode: null,
      addressInfo: null,
      address: null,
      availableStake: 0,
      time: 0,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
      toSend: '',
      txBody: null,
      txContext: null,
      txHash: null,
      txHeight: null,
      height50: false,
      errorMessage: null,
    });
    if (update) {
      update();
    }
  };

  onChangeSelect = e =>
    this.setState({
      valueSelect: e.target.value,
    });

  handleKeyPressFuckGoogle = e => {
    const { toSend } = this.state;
    if (toSend.length > 0) {
      if (e.key === 'Enter') {
        this.setState({
          stage: STAGE_SELECTION,
          height50: true,
        });
      }
    }
  };

  onClickFuckGoogle = () => {
    this.setState({
      stage: STAGE_SELECTION,
      height50: true,
    });
  };

  onClickInitStage = () => {
    this.cleatState();
    this.setState({
      stage: SELECT_PATH,
    });
  };

  onClickSelectLedgerTx = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  onChangeInputContributeATOMs = async evt => {
    this.setState({
      toSend: evt.target.value,
    });
  };

  onClickMax = () => {
    const { gas, gasPrice } = this.state;
    this.setState(prevState => ({
      toSend:
        Math.floor(
          ((prevState.availableStake - gas * gasPrice) / DIVISOR_ATOM) * 1000
        ) / 1000,
    }));
  };

  onClickContributeATOMs = () =>
    this.setState({
      step: 'transactionCost',
    });

  onClickTransactionCost = () =>
    this.setState({
      step: 'succesfuuly',
    });

  hasKey() {
    const { address } = this.state;
    return address !== null;
  }

  hasWallet() {
    const { addressInfo } = this.state;
    return addressInfo !== null;
  }

  onChangeTrackAddress = e => {
    this.setState({
      trackAddress: e.target.value,
    });
  };

  onClickSelectCustomTx = () => {
    this.setState({
      stage: CUSTOM_TX_CONTROL_PK,
    });
  };

  onClickIControl = () => {
    this.setState({
      stage: CUSTOM_TX_UNDERSTAND,
    });
  };

  onClickIUnderstand = () => {
    this.setState({
      stage: CUSTOM_TX_TRACK,
    });
  };

  onClickTrack = () => {
    const { trackAddress } = this.state;

    const addressLedgerCyber = {
      cyber: {
        bech32: '',
      },
    };

    const accounts = {
      cyber: {
        bech32: '',
      },
      cosmos: {
        bech32: '',
      },
    };

    if (trackAddress.match(PATTERN_COSMOS)) {
      const cyberAddress = getDelegator(
        trackAddress,
        CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
      );
      addressLedgerCyber.cyber.bech32 = cyberAddress;
      accounts.cyber.bech32 = cyberAddress;
      accounts.cosmos.bech32 = trackAddress;
      accounts.keys = 'user';

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));

      this.setState({
        stage: CUSTOM_TX_AGREE,
      });
    }
  };

  onClickIAgree = () => {
    this.setState({
      stage: CUSTOM_TX_TYPE_TX,
    });
  };

  onClickShow = () => {
    const { onClickPopapAdressTrue } = this.props;

    onClickPopapAdressTrue();
    this.setState({
      stage: SELECT_PATH,
    });
  };

  render() {
    const {
      valueSelect,
      step,
      height50,
      connect,
      returnCode,
      version,
      availableStake,
      address,
      gasPrice,
      gas,
      toSend,
      txMsg,
      txHash,
      txHeight,
      stage,
      errorMessage,
      time,
      trackAddress,
      days,
      hours,
      seconds,
      minutes,
    } = this.state;

    if (time) {
      return (
        <ActionBar>
          <div
            className="countdown-time text-glich"
            data-text="takeoff will start in"
          >
            takeoff will start in
          </div>
          <Timer
            days={days}
            hours={hours}
            seconds={seconds}
            minutes={minutes}
          />
        </ActionBar>
      );
    }

    if (stage === STAGE_INIT) {
      return (
        <ActionBar>
          <Pane
            display="flex"
            alignItems="center"
            flex={1}
            justifyContent="center"
          >
            <span className="actionBar-text">Contribute</span>
            <Input
              value={toSend}
              onChange={e => this.onChangeInputContributeATOMs(e)}
              placeholder="amount"
              onKeyPress={this.handleKeyPressFuckGoogle}
              marginLeft={20}
              marginRight={20}
              width="25%"
              height={42}
              fontSize="20px"
              textAlign="end"
              autoFocus
            />
            <Text color="#fff" fontSize="20px">
              ATOMs
            </Text>
          </Pane>
          <Button
            disabled={toSend.length === 0}
            onClick={this.onClickFuckGoogle}
          >
            Fuck Google
          </Button>
        </ActionBar>
      );
    }

    if (stage === STAGE_SELECTION) {
      return (
        <ActionBar>
          <Button marginX={10} onClick={this.onClickSelectCustomTx}>
            Custom transaction
          </Button>
          <Button marginX={10} onClick={this.onClickSelectLedgerTx}>
            Donate with Ledger
          </Button>
        </ActionBar>
      );
    }

    if (stage === CUSTOM_TX_CONTROL_PK) {
      return (
        <ActionBar>
          <ActionBarContentText>
            You can send donations directly to cyber~Congress multisig only if
            you control private keys of sending account.
          </ActionBarContentText>
          <Button marginX={10} onClick={this.onClickIControl}>
            I control
          </Button>
        </ActionBar>
      );
    }

    // 1.2
    //
    if (stage === CUSTOM_TX_UNDERSTAND) {
      return (
        <ActionBar>
          <ActionBarContentText>
            CYB will be allocated to sending addresses. All donations from
            custodial wallets, exchanges and banks will be lost.
          </ActionBarContentText>
          <Button marginX={10} onClick={this.onClickIUnderstand}>
            I understand
          </Button>
        </ActionBar>
      );
    }

    // 1.3
    // Put to pocket
    if (stage === CUSTOM_TX_TRACK) {
      return (
        <ActionBar>
          <ActionBarContentText>
            To track your donation provide your sending address{' '}
            <Input
              placeholder="address"
              maxWidth="170px"
              textAlign="end"
              marginLeft={10}
              autoFocus
              height={42}
              width="unset"
              value={trackAddress}
              onChange={e => this.onChangeTrackAddress(e)}
            />
          </ActionBarContentText>
          <Button
            marginX={10}
            disabled={!trackAddress.match(PATTERN_COSMOS)}
            onClick={this.onClickTrack}
          >
            Track
          </Button>
        </ActionBar>
      );
    }

    // 1.4
    //
    if (stage === CUSTOM_TX_AGREE) {
      return (
        <ActionBar>
          <ActionBarContentText display="inline">
            <Pane display="inline">
              By donating {toSend} ATOM you agree with donation terms defined in
            </Pane>{' '}
            <LinkWindow to="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ">
              Whitepaper
            </LinkWindow>{' '}
            <Pane display="inline">and</Pane>{' '}
            <LinkWindow to="https://cybercongress.ai/game-of-links/">
              Game of Links rules
            </LinkWindow>
            .
          </ActionBarContentText>
          <Button marginX={10} onClick={this.onClickIAgree}>
            I agree
          </Button>
        </ActionBar>
      );
    }

    // 1.5
    //
    if (stage === CUSTOM_TX_TYPE_TX) {
      return (
        <ActionBar>
          <ActionBarContentText>
            Amazing, now you can send ATOMs
          </ActionBarContentText>
          <Button paddingX={20} marginX={10} onClick={this.onClickShow}>
            Show address
          </Button>
          <Button paddingX={20} marginX={10} onClick={this.createTxForCLI}>
            Download tx
          </Button>
        </ActionBar>
      );
    }

    // // 1.6
    //

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(version, LEDGER_VERSION_REQ)
          }
        />
      );
    }

    if (stage === LEDGER_TX_ACOUNT_INFO) {
      return <CheckAddressInfo />;
    }

    if (stage === STAGE_READY && this.hasKey() && this.hasWallet()) {
      const balance = parseFloat(availableStake) / COSMOS.DIVISOR_ATOM;
      return (
        <ActionBar>
          <ActionBarContentText display="inline">
            <Pane display="inline">
              By donating {toSend} ATOM you agree with donation terms defined in
            </Pane>{' '}
            <LinkWindow to="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ">
              Whitepaper
            </LinkWindow>{' '}
            <Pane display="inline">and</Pane>{' '}
            <LinkWindow to="https://cybercongress.ai/game-of-links/">
              Game of Links rules
            </LinkWindow>
            .
          </ActionBarContentText>
          <Button
            marginX={10}
            disabled={parseFloat(toSend) > balance}
            onClick={this.generateTx}
          >
            I agree
          </Button>
        </ActionBar>
      );
    }

    if (stage === STAGE_WAIT) {
      return (
        <ActionBar>
          <ActionBarContentText>
            Confirm transaction on your Ledger{' '}
            <img
              alt="legder"
              style={{
                paddingTop: '8px',
                marginLeft: '10px',
                width: '150px',
                height: '50px',
              }}
              src={ledger}
            />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_SUBMITTED || stage === STAGE_CONFIRMING) {
      return (
        <ActionBar>
          <ActionBarContentText>
            Please wait while we confirm the transaction on the blockchain{' '}
            <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_CONFIRMED) {
      return (
        <ActionBar>
          <ActionBarContentText display="inline">
            <Pane display="inline">Transaction</Pane>{' '}
            <LinkWindow to={`https://www.mintscan.io/txs/${txHash}`}>
              {trimString(txHash, 6, 6)}
            </LinkWindow>{' '}
            <Pane display="inline">
              was included in the block at height {txHeight}
            </Pane>
          </ActionBarContentText>
          <Button marginX={10} onClick={this.onClickInitStage}>
            Fuck Google
          </Button>
        </ActionBar>
      );
    }

    if (stage === SELECT_PATH) {
      return (
        <ActionBar>
          <ActionBarContentText>
            Now its time to choose your path
          </ActionBarContentText>
          <Link
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0px 10px',
              padding: '0 30px',
            }}
            to="/search/master"
          >
            Master
          </Link>
          <Link
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0px 10px',
              padding: '0 30px',
            }}
            to="/heroes"
          >
            Hero
          </Link>
          <Link
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0px 10px',
              padding: '0px 25px',
            }}
            to="/search/evangelist"
          >
            Evangelist
          </Link>
        </ActionBar>
      );
    }

    if (stage === STAGE_ERROR && errorMessage !== null) {
      return (
        <TransactionError
          errorMessage={errorMessage}
          onClickBtn={this.onClickInitStage}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    return null;
  }
}

export default ActionBarTakeOff;
