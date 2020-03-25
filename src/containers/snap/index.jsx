import React from 'react';
import {
  Pane,
  Text,
  TableEv as Table,
  ActionBar,
} from '@cybercongress/gravity';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Link } from 'react-router-dom';
import { formatValidatorAddress } from '../../utils/utils';
import { PATTERN_IPFS_HASH } from '../../utils/config';
import { getIpfsHash } from '../../utils/search/utils';

const snapId = new URL(
  'https://ipfs.io/ipfs/Qmc12iCm3D9cG3Pe9LXoinWFxjwv5CJohm4MgX2wWiNMWZ',
  window.location.href
).toString();

class Snap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonTemp: null,
      txHash: null,
      subjectTo: '',
      amount: '',
      objectFrom: '',
      objectTo: '',
      stage: 'init',
    };
  }

  connect = async () => {
    try {
      const response = await window.ethereum.send({
        method: 'wallet_enable',
        params: [
          {
            wallet_plugin: { [snapId]: {} },
          },
        ],
      });
      this.setState({ jsonTemp: response });
    } catch (err) {
      console.error(err);
    }
  };

  getAccount = async () => {
    try {
      const response = await window.ethereum.send({
        method: 'wallet_invokePlugin',
        params: [
          snapId,
          {
            method: 'getAccount',
          },
        ],
      });
      // addAccount.innerText = JSON.stringify(response)
      console.log('getAccount: ', response);
      this.setState({ jsonTemp: response });
    } catch (err) {
      console.error(err);
      // addAccount.innerText = `Problem happened: ' ${JSON.stringify(err)}`
    }
  };

  getAccountInfo = async () => {
    try {
      const response = await window.ethereum.send({
        method: 'wallet_invokePlugin',
        params: [
          snapId,
          {
            method: 'getAccountInfo',
          },
        ],
      });
      // addAccountInfo.innerText = JSON.stringify(response);
      console.log('getAccountInfo: ', response);
      this.setState({ jsonTemp: response });
    } catch (err) {
      console.error(err);
      // addAccountInfo.innerText = `Problem happened: ' ${JSON.stringify(err)}`;
    }
  };

  getStatus = async () => {
    try {
      const response = await window.ethereum.send({
        method: 'wallet_invokePlugin',
        params: [
          snapId,
          {
            method: 'getStatus',
          },
        ],
      });
      // addStatus.innerText = JSON.stringify(response);
      console.log('getStatus: ', JSON.stringify(response));
      this.setState({ jsonTemp: response });
    } catch (err) {
      console.error(err);
      // addStatus.innerText = `Problem happened: ' ${JSON.stringify(err)}`;
    }
  };

  getBandwidth = async () => {
    try {
      const response = await window.ethereum.send({
        method: 'wallet_invokePlugin',
        params: [
          snapId,
          {
            method: 'getBandwidth',
          },
        ],
      });
      // addBandwidth.innerText = JSON.stringify(response);
      console.log('getBandwidth: ', JSON.stringify(response));
      this.setState({ jsonTemp: response });
    } catch (err) {
      console.error(err);
      // addBandwidth.innerText = `Problem happened: ' ${JSON.stringify(err)}`;
    }
  };

  createCyberlink = async () => {
    const { objectFrom, objectTo } = this.state;
    try {
      const data = {};
      if (objectFrom.match(PATTERN_IPFS_HASH)) {
        data.objectFrom = objectFrom;
      } else {
        data.objectFrom = await getIpfsHash(objectFrom);
      }
      if (objectTo.match(PATTERN_IPFS_HASH)) {
        data.objectTo = objectTo;
      } else {
        data.objectTo = await getIpfsHash(objectTo);
      }
      const response = await window.ethereum.send({
        method: 'wallet_invokePlugin',
        params: [
          snapId,
          {
            method: 'createCyberlink',
            params: [data],
          },
        ],
      });
      // addCyberlink.innerText = JSON.stringify(response);
      console.log(response);
      this.setState({
        txHash: response.txhash,
        jsonTemp: response,
        stage: 'confirm',
      });
    } catch (err) {
      console.error(err);
      // addCyberlink.innerText = `Problem happened: ' ${JSON.stringify(err)}`;
    }
  };

  createSend = async () => {
    const { subjectTo, amount } = this.state;
    try {
      const data = {};
      data.subjectTo = subjectTo;
      data.amount = amount;
      const response = await window.ethereum.send({
        method: 'wallet_invokePlugin',
        params: [
          snapId,
          {
            method: 'createSend',
            params: [data],
          },
        ],
      });
      // addSend.innerText = JSON.stringify(response);
      console.log(response);
      this.setState({
        txHash: response.txhash,
        jsonTemp: response,
        stage: 'confirm',
      });
    } catch (err) {
      console.error(err);
      // addSend.innerText = `Problem happened: ' ${JSON.stringify(err)}`;
    }
  };

  clear = () => {
    this.setState({
      txHash: null,
      subjectTo: '',
      amount: '',
      objectFrom: '',
      objectTo: '',
      stage: 'init',
    });
  };

  onChangeAddress = e => {
    this.setState({
      subjectTo: e.target.value,
    });
  };

  onChangeAmount = e => {
    this.setState({
      amount: e.target.value,
    });
  };

  onChangeObjectFrom = e => {
    this.setState({
      objectFrom: e.target.value,
    });
  };

  onChangeObjectTo = e => {
    this.setState({
      objectTo: e.target.value,
    });
  };

  onClickToStage = stage => {
    this.setState({
      stage,
    });
  };

  render() {
    const {
      jsonTemp,
      stage,
      subjectTo,
      amount,
      objectFrom,
      objectTo,
      txHash,
    } = this.state;

    return (
      <div>
        <main className="block-body-home">
          <Pane display="grid" gridTemplateColumns="repeat(2, 50%)">
            <Pane
              gridTemplateColumns="repeat(auto-fill, 80%)"
              display="grid"
              gridGap="20px"
              width="100%"
              alignContent="flex-start"
            >
              <button
                className="btn"
                type="button"
                onClick={() => this.connect()}
              >
                Install Snap
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => this.getAccount()}
              >
                Get Account
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => this.getAccountInfo()}
              >
                Get Account Info
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => this.getBandwidth()}
              >
                Get Bandwidth
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => this.getStatus()}
              >
                Get Network Status
              </button>
            </Pane>
            <Pane boxShadow="0 0 2px #3ab793">
              <div
                style={{
                  height: '100%',
                  padding: 0,
                }}
                className="container-json"
              >
                <SyntaxHighlighter language="json" style={docco}>
                  {JSON.stringify(jsonTemp, null, 2)}
                </SyntaxHighlighter>
              </div>
            </Pane>
          </Pane>
        </main>
        <ActionBar>
          {stage === 'init' && (
            <div>
              {' '}
              <button
                type="button"
                className="btn"
                onClick={() => this.onClickToStage('send')}
                style={{ margin: '0 5px' }}
              >
                Send
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => this.onClickToStage('link')}
                style={{ margin: '0 5px' }}
              >
                Link
              </button>
            </div>
          )}
          {stage === 'send' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '1000px',
                width: '100%',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <input
                  placeholder="address"
                  value={subjectTo}
                  onChange={e => this.onChangeAddress(e)}
                  style={{
                    height: '42px',
                    marginRight: '20px',
                  }}
                />
                <input
                  placeholder="EUL"
                  value={amount}
                  onChange={e => this.onChangeAmount(e)}
                  style={{
                    height: '42px',
                    marginRight: '20px',
                    width: '20%',
                  }}
                />
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => this.createSend()}
                style={{ margin: '0 5px' }}
              >
                sign
              </button>
            </div>
          )}
          {stage === 'link' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '1000px',
                width: '100%',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <input
                  placeholder="From"
                  value={objectFrom}
                  onChange={e => this.onChangeObjectFrom(e)}
                  style={{
                    height: '42px',
                    marginRight: '20px',
                  }}
                />
                <input
                  placeholder="To"
                  value={objectTo}
                  onChange={e => this.onChangeObjectTo(e)}
                  style={{
                    height: '42px',
                    marginRight: '20px',
                  }}
                />
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => this.createCyberlink()}
                style={{ margin: '0 5px' }}
              >
                sign
              </button>
            </div>
          )}
          {stage === 'confirm' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '1000px',
                width: '100%',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
                className="text-default"
              >
                Check TX status:
                <Link
                  style={{ marginLeft: 10 }}
                  to={`/network/euler-5/tx/${txHash}`}
                >
                  {formatValidatorAddress(txHash, 8, 8)}
                </Link>
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => this.clear()}
                style={{ margin: '0 5px' }}
              >
                ok
              </button>
            </div>
          )}
        </ActionBar>
      </div>
    );
  }
}

export default Snap;
