import React, { Component } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import { coins } from '@cosmjs/launchpad';
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
import { AppContext } from '../../context';

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
const ADD_ADDRESS = 2.1;
const LEDGER_TX_ACOUNT_INFO = 12;
const STAGE_ADD_ADDRESS_OK = 2.2;
const STAGE_IPFS_HASH = 3.1;
const STAGE_KEPLR_APPROVE = 3.2;

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      address: null,
      addressLocalStor: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
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
      errorMessage: null,
      file: null,
      connectLedger: null,
      fromCid: null,
      toCid: null,
    };
    this.timeOut = null;
    this.inputOpenFileRef = React.createRef();
  }

  async componentDidMount() {
    console.warn('Looking for Ledger Nano');
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
    if (
      stage === STAGE_IPFS_HASH &&
      fromCid &&
      toCid &&
      toCid !== null &&
      fromCid !== null
    ) {
      this.generateTxKeplr();
    }
  }

  getLedgerAddress = async () => {
    const { stage } = this.state;

    this.transport = await TransportWebUSB.create(120 * 1000);
    this.ledger = new CosmosDelegateTool(this.transport);

    const connectLedger = await this.ledger.connect();
    console.log(connectLedger, stage);
    if (connectLedger.return_code === LEDGER_OK) {
      console.log(' :>> ', stage);
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
    const { node } = this.props;

    let fromCid = 'tweet';

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

  getAddressInfo = async () => {
    try {
      const { address } = this.state;
      this.setState({
        stage: LEDGER_TX_ACOUNT_INFO,
      });
      let chainId = '';
      const addressInfo = await this.ledger.getAccountInfoCyber(address);
      const responseStatusNode = await statusNode();
      if (responseStatusNode !== null) {
        chainId = responseStatusNode.node_info.network;
      }

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

  generateTxKeplr = async () => {
    const { keplr } = this.context;
    const { fromCid, toCid } = this.state;

    console.log('fromCid, toCid :>> ', fromCid, toCid);

    this.setState({
      stage: STAGE_KEPLR_APPROVE,
    });
    console.log(`keplr`, keplr);
    if (keplr !== null) {
      await window.keplr.enable(CYBER.CHAIN_ID);
      const { address } = await keplr.getAccount();

      const msgs = [];
      msgs.push({
        type: 'cyber/Link',
        value: {
          address,
          links: [
            {
              from: fromCid,
              to: toCid,
            },
          ],
        },
      });
      const fee = {
        amount: coins(0, 'uatom'),
        gas: '100000',
      };
      console.log('msg', msgs);
      const result = await keplr.signAndBroadcast(msgs, fee, CYBER.MEMO_KEPLR);
      console.log('result: ', result);
      const hash = result.transactionHash;
      console.log('hash :>> ', hash);
      this.setState({ stage: STAGE_SUBMITTED, txHash: hash });
      this.timeOut = setTimeout(this.confirmTx, 1500);
    }
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
      address: null,
      addressLocalStor: null,
      returnCode: null,
      addressInfo: null,
      ledgerVersion: [0, 0, 0],
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
      errorMessage: null,
      file: null,
      connectLedger: null,
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
    const { addressPocket } = this.props;

    if (
      addressPocket !== null &&
      addressPocket.keys &&
      addressPocket.keys === 'ledger'
    ) {
      await this.setState({
        stage: STAGE_LEDGER_INIT,
      });
      this.getLedgerAddress();
    }

    if (
      addressPocket !== null &&
      addressPocket.keys &&
      addressPocket.keys === 'keplr'
    ) {
      await this.setState({
        stage: STAGE_IPFS_HASH,
      });
      this.calculationIpfsFrom();
      this.calculationIpfsTo();
    }
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

  onClickConnect = async () => {
    await this.setState({
      stage: ADD_ADDRESS,
    });
    this.getLedgerAddress();
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
    const { addressPocket } = this.props;

    if (stage === STAGE_INIT) {
      return (
        <StartStageSearchActionBar
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
          placeholder="What's happening?"
          textBtn="Tweet"
          keys={
            addressPocket && addressPocket !== null ? addressPocket.keys : false
          }
        />
      );
    }

    if (stage === STAGE_LEDGER_INIT || stage === ADD_ADDRESS) {
      return (
        <ConnectLadger
          onClickConnect={() => this.getLedgerAddress()}
          connectLedger={connectLedger}
        />
      );
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

    if (stage === LEDGER_TX_ACOUNT_INFO) {
      return <CheckAddressInfo />;
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

ActionBarContainer.contextType = AppContext;

export default connect(mapStateToProps)(ActionBarContainer);
