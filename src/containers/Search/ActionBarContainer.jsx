import React, { Component } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link as LinkRoute } from 'react-router-dom';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  ConnectLadger,
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  StartStageSearchActionBar,
  Cyberlink,
  TransactionError,
  ActionBarContentText,
  CheckAddressInfo,
  Dots,
} from '../../components';

import {
  getIpfsHash,
  getPin,
  statusNode,
  getAccountBandwidth,
  getCurrentBandwidthPrice,
} from '../../utils/search/utils';

import { LEDGER, CYBER, PATTERN_IPFS_HASH } from '../../utils/config';
import { trimString } from '../../utils/utils';

const { AccAddress } = require('@chainapsis/cosmosjs/common/address');
const { Coin } = require('@chainapsis/cosmosjs/common/coin');
const { MsgLink, Link } = require('@chainapsis/cosmosjs/x/link');

const {
  MEMO,
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
  LEDGER_VERSION_REQ,
} = LEDGER;

const CREATE_LINK = 10;
const ADD_ADDRESS = 11;
const LEDGER_TX_ACOUNT_INFO = 12;
const STAGE_IPFS_HASH = 3.1;
const STAGE_KEPLR_APPROVE = 3.2;

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      init: false,
      address: null,
      addressLocalStor: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      bandwidth: {
        remained: 0,
        max_value: 0,
      },
      linkPrice: 0,
      contentHash: '',
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      error: null,
      errorMessage: null,
      file: null,
      connectLedger: null,
      fromCid: null,
      toCid: null,
    };
    this.timeOut = null;
    this.inputOpenFileRef = React.createRef();
    this.ledger = null;
    this.transport = null;
  }

  async componentDidMount() {
    console.warn('Looking for Ledger Nano');
    await this.checkAddressLocalStorage();
    this.ledger = new CosmosDelegateTool();
  }

  componentDidUpdate() {
    const { stage, address, addressInfo, fromCid, toCid } = this.state;
    if (
      stage === STAGE_LEDGER_INIT ||
      stage === STAGE_READY ||
      stage === LEDGER_TX_ACOUNT_INFO
    ) {
      if (
        address !== null &&
        addressInfo !== null &&
        toCid !== null &&
        fromCid !== null
      ) {
        this.stageReady();
      }
    }

    if (stage === STAGE_IPFS_HASH) {
      if (toCid !== null && fromCid !== null) {
        this.generateTx();
      }
    }
  }

  checkAddressLocalStorage = async () => {
    let address = [];

    const localStorageStory = await localStorage.getItem('pocket');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLocalStor: address });
    } else {
      this.setState({
        addressLocalStor: null,
      });
    }
  };

  getLedgerAddress = async () => {
    const { stage } = this.state;

    this.transport = await TransportWebUSB.create(120 * 1000);
    this.ledger = new CosmosDelegateTool(this.transport);

    const connectLedger = await this.ledger.connect();
    console.log(connectLedger, stage);
    if (connectLedger.return_code === LEDGER_OK) {
      this.setState({
        connectLedger: true,
      });
      if (stage === STAGE_LEDGER_INIT) {
        const address = await this.ledger.retrieveAddressCyber(HDPATH);
        console.log('address', address);
        this.setState({
          address,
        });
        this.getAddressInfo();
        this.calculationIpfsFrom();
        this.calculationIpfsTo();
      }
    } else {
      this.setState({
        connectLedger: false,
      });
    }
  };

  calculationIpfsTo = async () => {
    const { contentHash, file } = this.state;
    const { node } = this.props;

    let toCid = contentHash;
    if (file !== null) {
      toCid = file;
    }

    if (file !== null) {
      toCid = await getPin(node, toCid);
    } else if (!toCid.match(PATTERN_IPFS_HASH)) {
      toCid = await getPin(node, toCid);
    }

    this.setState({
      toCid,
    });
  };

  calculationIpfsFrom = async () => {
    const { keywordHash, node } = this.props;

    let fromCid = keywordHash;

    if (!fromCid.match(PATTERN_IPFS_HASH)) {
      fromCid = await getPin(node, fromCid);
    }

    this.setState({
      fromCid,
    });
  };

  stageReady = () => {
    this.link();
  };

  getNetworkId = async () => {
    const data = await statusNode();
    return data.node_info.network;
  };

  getAddressInfo = async () => {
    try {
      const { address } = this.state;
      this.setState({
        stage: LEDGER_TX_ACOUNT_INFO,
      });
      const addressInfo = await this.ledger.getAccountInfoCyber(address);
      const chainId = await this.getNetworkId();

      addressInfo.chainId = chainId;

      this.setState({
        addressInfo,
        stage: STAGE_READY,
      });
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== 'getAddressInfo') {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('getAddressInfo', message, statusCode);
      }
      this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    }
  };

  onClickInitKeplr = () => {
    this.calculationIpfsFrom();
    this.calculationIpfsTo();
    this.setState({
      stage: STAGE_IPFS_HASH,
    });
  };

  generateTx = async () => {
    const { keplr } = this.props;
    const { fromCid, toCid } = this.state;

    this.setState({
      stage: STAGE_KEPLR_APPROVE,
    });

    await keplr.enable();

    const sender = AccAddress.fromBech32(
      (await keplr.getKeys())[0].bech32Address,
      'cyber'
    );
    const msg = new MsgLink(sender, [new Link(fromCid, toCid)]);

    const result = await keplr.sendMsgs(
      [msg],
      {
        gas: 100000,
        memo: '',
        fee: new Coin('eul', 200),
      },
      'async'
    );
    console.log('result: ', result);
    const hash = result.hash.toString('hex').toUpperCase();
    console.log('hash :>> ', hash);
    this.setState({ stage: STAGE_SUBMITTED, txHash: hash });
    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  link = async () => {
    const { address, addressInfo, fromCid, toCid } = this.state;

    const txContext = {
      accountNumber: addressInfo.accountNumber,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };

    const tx = await this.ledger.txCreateLink(
      txContext,
      address.bech32,
      fromCid,
      toCid,
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
    const txSubmit = await this.ledger.txSubmitCyber(txBody);
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
    const { update } = this.props;
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const status = await this.ledger.txStatusCyber(this.state.txHash);
      console.log('status', status);
      const data = await status;
      if (data.logs) {
        this.setState({
          stage: STAGE_CONFIRMED,
          txHeight: data.height,
        });
        if (update) {
          update();
        }
        return;
      }
      if (data.code) {
        this.setState({
          stage: STAGE_ERROR,
          txHeight: data.height,
          errorMessage: data.raw_log,
        });
        return;
      }
    }
    this.timeOut = setTimeout(this.confirmTx, 1500);
  };

  onChangeInput = async (e) => {
    const { value } = e.target;
    this.setState({
      contentHash: value,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      init: false,
      ledger: null,
      address: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      linkPrice: 0,
      contentHash: '',
      txMsg: null,
      txContext: null,
      txBody: null,
      txHeight: null,
      txHash: null,
      error: null,
      errorMessage: null,
      file: null,
      fromCid: null,
      toCid: null,
    });
    this.timeOut = null;
  };

  onClickInitStage = () => {
    this.cleatState();
    this.setState({
      stage: STAGE_INIT,
    });
  };

  onClickInitLedger = async () => {
    // this.init();
    await this.setState({
      stage: STAGE_LEDGER_INIT,
    });
    this.getLedgerAddress();
  };

  onClickClear = () => {
    this.setState({
      file: null,
    });
  };

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  onFilePickerChange = (files) => {
    const file = files.current.files[0];

    this.setState({
      file,
    });
  };

  render() {
    const {
      address,
      connectLedger,
      bandwidth,
      contentHash,
      returnCode,
      ledgerVersion,
      stage,
      txMsg,
      txHeight,
      txHash,
      errorMessage,
      file,
      linkPrice,
      addressLocalStor,
    } = this.state;

    const { textBtn, placeholder } = this.props;

    if (stage === STAGE_INIT && addressLocalStor === null) {
      return (
        <ActionBar>
          <ActionBarContentText>
            Play Game of Links. Get EUL with
            <LinkRoute
              style={{
                paddingTop: 10,
                margin: '0 15px',
                paddingBottom: 10,
                display: 'block',
              }}
              className="btn"
              to="/gol/takeoff"
            >
              ATOM
            </LinkRoute>
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_INIT && addressLocalStor.keys === 'ledger') {
      return (
        <StartStageSearchActionBar
          textBtn={textBtn}
          onClickBtn={this.onClickInitLedger}
          contentHash={
            file !== null && file !== undefined ? file.name : contentHash
          }
          onChangeInputContentHash={this.onChangeInput}
          inputOpenFileRef={this.inputOpenFileRef}
          showOpenFileDlg={this.showOpenFileDlg}
          onChangeInput={this.onFilePickerChange}
          onClickClear={this.onClickClear}
          file={file}
          placeholder={placeholder}
        />
      );
    }

    if (stage === STAGE_INIT && addressLocalStor.keys === 'keplr') {
      return (
        <StartStageSearchActionBar
          textBtn={textBtn || 'Cyberlink using Keplr'}
          onClickBtn={this.onClickInitKeplr}
          contentHash={
            file !== null && file !== undefined ? file.name : contentHash
          }
          onChangeInputContentHash={this.onChangeInput}
          inputOpenFileRef={this.inputOpenFileRef}
          showOpenFileDlg={this.showOpenFileDlg}
          onChangeInput={this.onFilePickerChange}
          onClickClear={this.onClickClear}
          file={file}
          placeholder={placeholder}
        />
      );
    }

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

    if (stage === STAGE_IPFS_HASH) {
      return (
        <ActionBar>
          <ActionBarContentText>
            adding content to IPFS <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_KEPLR_APPROVE) {
      return (
        <ActionBar>
          <ActionBarContentText>
            approve TX <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_READY) {
      return (
        <ActionBar>
          <ActionBarContentText>
            transaction generation <Dots big />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_WAIT) {
      return (
        <JsonTransaction
          txMsg={txMsg}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    if (stage === STAGE_SUBMITTED || stage === STAGE_CONFIRMING) {
      return <TransactionSubmitted onClickBtnCloce={this.onClickInitStage} />;
    }

    if (stage === STAGE_CONFIRMED) {
      return (
        <Confirmed
          txHash={txHash}
          txHeight={txHeight}
          onClickBtn={this.onClickInitStage}
          onClickBtnCloce={this.onClickInitStage}
        />
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

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(ActionBarContainer);
