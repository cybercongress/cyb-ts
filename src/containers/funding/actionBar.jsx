import React, { Component } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link } from 'react-router-dom';
import { Input, ActionBar, Pane, Text, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  COSMOS,
  LEDGER,
  PATTERN_COSMOS,
  CYBER,
  TAKEOFF,
  WP,
} from '../../utils/config';
import {
  getDelegator,
  downloadObjectAsJson,
  trimString,
  getTimeRemaining,
  formatNumber,
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
      addressInfo: null,
      address: null,
      availableStake: 0,
      toSend: '',
      txBody: null,
      txContext: null,
      txHash: null,
      txHeight: null,
      connectLedger: null,
      memo: '',
      trackAddress: '',
    };
    this.timeOut = null;
    this.transport = null;
    this.ledger = null;
  }

  componentDidMount() {
    // eslint-disable-next-line
    console.warn('Looking for Ledger Nano');
    const localStorageStory = localStorage.getItem('thanks');
    if (localStorageStory !== null) {
      const thanks = JSON.parse(localStorageStory);
      const memo = `thanks to ${thanks}`;
      this.setState({ memo });
    } else {
      this.setState({ memo: MEMO });
    }
  }

  getLedgerAddress = async () => {
    const accounts = {};
    this.transport = await TransportWebUSB.create(120 * 1000);
    this.ledger = new CosmosDelegateTool(this.transport);

    const connect = await this.ledger.connect();
    console.log(connect);
    if (connect.return_code === LEDGER_OK) {
      this.setState({
        connectLedger: true,
      });
      const address = await this.ledger.retrieveAddress(HDPATH);
      const addressLedgerCyber = await this.ledger.retrieveAddressCyber(HDPATH);

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
      this.getAddressInfo();
    } else {
      this.setState({
        connectLedger: false,
      });
    }
  };

  getAddressInfo = async () => {
    const { address } = this.state;
    this.setState({
      stage: LEDGER_TX_ACOUNT_INFO,
    });

    const addressInfo = await this.ledger.getAccountInfo(address);

    console.log(addressInfo);

    this.setState({
      addressInfo,
      availableStake: parseFloat(addressInfo.balanceuAtom),
      stage: STAGE_READY,
    });
  };

  createTxForCLI = async () => {
    const { trackAddress, toSend, memo } = this.state;
    const addressTo = ADDR_FUNDING;
    const uatomAmount = toSend * DIVISOR_ATOM;

    const tx = await this.ledger.txCreateSend(
      null,
      addressTo,
      uatomAmount,
      memo,
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
    const { address, addressInfo, toSend, memo } = this.state;
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

    const tx = await this.ledger.txCreateSend(
      txContext,
      validatorBech32,
      uatomAmount,
      memo
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
    const { txMsg, txContext } = this.state;
    // console.log('txContext', txContext);
    this.setState({ stage: STAGE_WAIT });
    const sing = await this.ledger.sign(txMsg, txContext);
    console.log('sing', sing);
    if (sing.return_code === LEDGER.LEDGER_OK) {
      const applySignature = await this.ledger.applySignature(
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
    const { txBody } = this.state;
    const txSubmit = await this.ledger.txSubmit(txBody);
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
    const { txHash } = this.state;
    const { update } = this.props;
    if (txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.ledger.txStatus(txHash);
      const data = await status;
      if (data.logs && data.logs[0].success === true) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });
        if (update) {
          update();
        }
        return;
      }
    }
    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  cleatState = () => {
    const { update } = this.props;
    this.setState({
      stage: STAGE_INIT,
      addressInfo: null,
      address: null,
      availableStake: 0,
      toSend: '',
      txBody: null,
      txContext: null,
      txHash: null,
      txHeight: null,
      connectLedger: null,
      memo: '',
      trackAddress: '',
    });
    this.timeOut = null;
    this.transport = null;
    this.ledger = null;
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
        });
      }
    }
  };

  onClickFuckGoogle = () => {
    this.setState({
      stage: STAGE_SELECTION,
    });
  };

  onClickInitStage = () => {
    this.cleatState();
    this.setState({
      stage: STAGE_INIT,
    });
  };

  onClickSelectLedgerTx = () => {
    this.getLedgerAddress();
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  onChangeInputContributeATOMs = async evt => {
    this.setState({
      toSend: evt.target.value,
    });
  };

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

  onClickShowMob = () => {
    this.setState({
      stage: CUSTOM_TX_CONTROL_PK,
    });
  };

  onClickShow = () => {
    const { onClickPopapAdressTrue } = this.props;

    onClickPopapAdressTrue();
    this.setState({
      stage: SELECT_PATH,
    });
  };

  onClickToPath = () => {
    const { onClickPopapAdressTrue } = this.props;

    this.cleatState();
    this.setState({
      stage: SELECT_PATH,
    });
  };

  onClickIUnderstandMob = () => {
    const { onClickPopapAdressTrue } = this.props;

    onClickPopapAdressTrue();
    this.setState({
      stage: STAGE_INIT,
    });
  };

  render() {
    const {
      availableStake,
      toSend,
      txHash,
      txHeight,
      stage,
      errorMessage,
      trackAddress,
      connectLedger,
    } = this.state;
    const { end, mobile } = this.props;
    console.log('connectLedger', connectLedger);

    if (end <= 0) {
      return (
        <ActionBar>
          <div
            className="countdown-time text-glich"
            data-text="Takeoff was successful"
          >
            Takeoff was successful
          </div>
        </ActionBar>
      );
    }

    if (mobile && stage === STAGE_INIT) {
      return (
        <ActionBar>
          <Button paddingX={20} marginX={10} onClick={this.onClickShowMob}>
            Show address
          </Button>
        </ActionBar>
      );
    }

    if (mobile && stage === CUSTOM_TX_CONTROL_PK) {
      return (
        <ActionBar>
          <Pane className="container-actionBar-mobile">
            <ActionBarContentText className="text-actionBar-mob">
              You can send donations directly to cyber~Congress multisig only if
              you control the private keys of the sending account!
            </ActionBarContentText>
            <Button
              fontSize="15px;"
              height="32px"
              lineHeight="30px"
              onClick={this.onClickIControl}
            >
              I control
            </Button>
          </Pane>
        </ActionBar>
      );
    }

    if (mobile && stage === CUSTOM_TX_UNDERSTAND) {
      return (
        <ActionBar>
          <Pane className="container-actionBar-mobile">
            <ActionBarContentText className="text-actionBar-mob">
              CYB will be allocated to the sending addresses. Any donations from
              custodial wallets, exchanges and banks will be lost.
            </ActionBarContentText>
            <Button
              fontSize="15px;"
              height="32px"
              lineHeight="30px"
              onClick={this.onClickIUnderstandMob}
            >
              I understand
            </Button>
          </Pane>
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
            Donate
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
            Donate using Ledger
          </Button>
        </ActionBar>
      );
    }

    if (stage === CUSTOM_TX_CONTROL_PK) {
      return (
        <ActionBar>
          <ActionBarContentText>
            You can send donations directly to cyber~Congress multisig only if
            you control the private keys of the sending account!
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
            CYB will be allocated to the sending addresses. Any donations from
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
              By donating {toSend} ATOM you agree with the donation terms
              defined in the
            </Pane>{' '}
            <LinkWindow to={WP}>Whitepaper</LinkWindow>{' '}
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
          onClickConnect={() => this.getLedgerAddress()}
          connectLedger={connectLedger}
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
              By donating {toSend} ATOM you agree with the donation terms
              defined in the
            </Pane>{' '}
            <LinkWindow to={WP}>Whitepaper</LinkWindow>{' '}
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
      return <JsonTransaction />;
    }

    if (stage === STAGE_SUBMITTED || stage === STAGE_CONFIRMING) {
      return <TransactionSubmitted />;
    }

    if (stage === STAGE_CONFIRMED) {
      return (
        <Confirmed
          txHash={txHash}
          txHeight={txHeight}
          cosmos
          onClickBtnCloce={this.onClickToPath}
        />
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
            to="/evangelism"
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
