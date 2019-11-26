import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import CosmosApp, { getBech32FromPK } from 'ledger-cosmos-js';
import { CosmosDelegateTool } from '../../utils/ledger';

import { indexedNode, MEMO } from '../../utils/config';

const TIMEOUT = 5000;
const HDPATH = [44, 118, 0, 0, 0];
const LEDGER_OK = 36864;
const LEDGER_NOAPP = 28160;

const STAGE_INIT = 0;
const STAGE_SELECTION = 1;
const STAGE_LEDGER_INIT = 2;
const CHAIN_ID = 'euler-dev';

class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_LEDGER_INIT,
      ledger: null,
      address: null,
      returnCode: null,
      addressInfo: null,
      versionInfo: [0, 0, 0],
      time: 0,
      bandwidth: {
        remained: 0,
        max_value: 0,
      },
      valueInput: '',
      txMsg: null,
      txContext: null,
      txBody: null,
      error: null,
    };
  }

  async componentDidMount() {
    console.warn('Looking for Ledger Nano');
    await this.pollLedger();
    await this.getVersion();
    await this.getAddress();
    await this.getAddressInfo();
  }

  // componentWillUpdate() {
  //   const { stage, ledger, address, addressInfo, returnCode } = this.state;
  //   if (ledger === null) {
  //     this.pollLedger();
  //   }
  //   if (stage === STAGE_LEDGER_INIT) {
  //     if (ledger !== null) {
  //       switch (returnCode) {
  //         case LEDGER_OK:
  //           if (address === null) {
  //             console.log('getAddress');
  //             this.getAddress();
  //           }
  //           if (address !== null && addressInfo === null) {
  //             console.log('getWallet');
  //              this.getAddressInfo();
  //              this.getBandwidth();
  //           }
  //           break;
  //         default:
  //           console.log('getVersion');
  //           this.getVersion();
  //           break;
  //       }
  //     } else {
  //       // eslint-disable-next-line
  //               console.warn('Still looking for a Ledger device.');
  //     }
  //   }
  // }

  pollLedger = async () => {
    const transport = await TransportU2F.create();
    this.setState({ ledger: new CosmosDelegateTool(transport) });
    // await this.getBandwidth();
  };

  getVersion = async () => {
    const { ledger, returnCode } = this.state;
    try {
      const connect = await ledger.connect();
      if (returnCode === null || connect.return_code !== returnCode) {
        this.setState({
          address: null,
          returnCode: connect.return_code,
          version_info: [connect.major, connect.minor, connect.patch],
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
    const { ledger } = this.state;

    const address = await ledger.retrieveAddressCyber(HDPATH);

    console.log('address', address);

    this.setState({
      address,
    });
  };

  getStatus = async () => {
    const response = await fetch(`${indexedNode}/api/status`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.result;
  };

  getNetworkId = async () => {
    const data = await this.getStatus();
    return data.node_info.network;
  };

  getAddressInfo = async () => {
    const { ledger, address } = this.state;

    const addressInfo = await ledger.getAccountInfoCyber(address);
    const chainId = await this.getNetworkId();

    addressInfo.chainId = chainId;

    this.setState({
      addressInfo,
    });
  };

  getBandwidth = async () => {
    const { address } = this.state;

    const bandwidth = {
      remained: 0,
      max_value: 0,
    };

    const getBandwidth = await fetch(
      `${indexedNode}/api/account_bandwidth?address="${address.bech32}"`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await getBandwidth.json();

    bandwidth.remained = data.result.remained;
    bandwidth.max_value = data.result.max_value;

    this.setState({
      bandwidth,
    });
  };

  // link = async () => {
  //   const { valueInput } = this.state;
  //   console.log('valueInput', valueInput);
  // };

  link = async () => {
    const {
      address,
      addressInfo,
      ledger,
      keywordHash,
      contentHash,
    } = this.state;

    const fromCid = keywordHash;
    const toCid = contentHash;

    const txContext = {
      accountNumber: addressInfo.accountNumber,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: address.bech32,
      pk: address.pk,
      path: address.path,
    };

    const tx = await ledger.txCreateLink(
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
    const { txMsg, ledger, txContext } = this.state;
    // console.log('txContext', txContext);
    // this.setState({ stage: STAGE_WAIT });
    const sing = await ledger.sign(txMsg, txContext);
    console.log('sing', sing);
    // if (sing !== null) {
    await this.setState({
      txMsg: null,
      txBody: sing,
      // stage: STAGE_SUBMITTED
    });
    await this.injectTx();
    // }
  };

  injectTx = async () => {
    const { ledger, txBody } = this.state;
    const txSubmit = await ledger.txSubmitCyberLink(txBody);
    const data = txSubmit;
    console.log('data', data);
  };

  onChangeInput = async e => {
    const { value } = e.target;
    this.setState({
      valueInput: value,
    });
  };

  render() {
    const { ledger, address, addressInfo, bandwidth, valueInput } = this.state;

    // console.log('address', address);
    // console.log('ledger', ledger);

    return (
      <div>
        <input
          value={valueInput}
          style={{ marginRight: 10 }}
          onChange={e => this.onChangeInput(e)}
        />
        <button
          type="button"
          className="btn"
          onClick={e => this.link(e)}
          style={{ height: 30 }}
        >
          link
        </button>
      </div>
    );
  }
}

export default ActionBar;
