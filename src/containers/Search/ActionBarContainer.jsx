/* eslint-disable */
import React, { Component } from 'react';
import { Link as LinkRoute } from 'react-router-dom';
import { Pane, ActionBar } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import {
  TransactionSubmitted,
  Confirmed,
  StartStageSearchActionBar,
  TransactionError,
  ActionBarContentText,
  Dots,
  ButtonImgText,
} from '../../components';

import { getPin, getTxs } from '../../utils/search/utils';

import {
  LEDGER,
  CYBER,
  PATTERN_IPFS_HASH,
  DEFAULT_GAS_LIMITS,
} from '../../utils/config';
import { trimString } from '../../utils/utils';
import { AppContext } from '../../context';
import { pinToIpfsCluster } from 'src/utils/ipfs/cluster-utils';
import { withIpfsAndKeplr } from '../Wallet/actionBarTweet';

const imgKeplr = require('../../image/keplr-icon.svg');
const imgLedger = require('../../image/ledger.svg');
const imgCyber = require('../../image/blue-circle.png');

const {
  STAGE_INIT,
  STAGE_READY,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
} = LEDGER;

const STAGE_IPFS_HASH = 3.1;
const STAGE_KEPLR_APPROVE = 3.2;

class ActionBarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      addressLocalStor: null,
      contentHash: '',
      txHeight: null,
      txHash: null,
      errorMessage: null,
      file: null,
      fromCid: null,
      toCid: null,
    };
    this.timeOut = null;
    this.inputOpenFileRef = React.createRef();
    this.transport = null;
  }

  async componentDidMount() {
    console.warn('Looking for Ledger Nano');
    await this.checkAddressLocalStorage();
  }

  componentDidUpdate(prevProps) {
    const { stage, fromCid, toCid } = this.state;
    const { defaultAccount } = this.props;

    if (stage === STAGE_IPFS_HASH) {
      if (toCid !== null && fromCid !== null) {
        this.generateTx();
      }
    }
    if (prevProps.defaultAccount.name !== defaultAccount.name) {
      this.checkAddressLocalStorage();
    }
  }

  checkAddressLocalStorage = async () => {
    const { defaultAccount } = this.props;
    const { account } = defaultAccount;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32 } = account.cyber;
      if (keys !== 'read-only') {
        this.setState({
          addressLocalStor: { address: bech32, keys },
        });
      } else {
        this.setState({
          addressLocalStor: null,
        });
      }
    } else {
      this.setState({
        addressLocalStor: null,
      });
    }
  };

  calculationIpfsTo = async () => {
    const { contentHash, file } = this.state;
    const { node } = this.props;
    let content = '';
    let toCid;

    content = contentHash;
    if (file !== null) {
      content = file;
    }
    console.log('toCid', content);
    if (file === null && content.match(PATTERN_IPFS_HASH)) {
      toCid = content;
    } else {
      toCid = await getPin(node, content);
    }

    this.setState({
      toCid,
    });

    const datapinToIpfsCluster = await pinToIpfsCluster(toCid, content);
    console.log(`datapinToIpfsCluster`, datapinToIpfsCluster);
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

  onClickInitKeplr = () => {
    this.calculationIpfsFrom();
    this.calculationIpfsTo();
    this.setState({
      stage: STAGE_IPFS_HASH,
    });
  };

  generateTx = async () => {
    try {
      const { keplr } = this.props;
      const { fromCid, toCid, addressLocalStor } = this.state;

      this.setState({
        stage: STAGE_KEPLR_APPROVE,
      });
      if (keplr !== null) {
        const chainId = CYBER.CHAIN_ID;
        await window.keplr.enable(chainId);
        const { address } = (await keplr.signer.getAccounts())[0];

        console.log('address', address);
        if (addressLocalStor !== null && addressLocalStor.address === address) {
          const fee = {
            amount: [],
            gas: DEFAULT_GAS_LIMITS.toString(),
          };
          const result = await keplr.cyberlink(address, fromCid, toCid, fee);
          if (result.code === 0) {
            const hash = result.transactionHash;
            console.log('hash :>> ', hash);
            this.setState({ stage: STAGE_SUBMITTED, txHash: hash });
            this.timeOut = setTimeout(this.confirmTx, 1500);
          } else if (result.code === 4) {
            this.setState({
              txHash: null,
              stage: STAGE_ERROR,
              errorMessage:
                'Cyberlinking and investmint are not working. Wait for updates.',
            });
          } else {
            this.setState({
              txHash: null,
              stage: STAGE_ERROR,
              errorMessage: result.rawLog.toString(),
            });
          }
          console.log('result: ', result);
        } else {
          this.setState({
            stage: STAGE_ERROR,
            errorMessage: `Add address ${trimString(
              address,
              9,
              5
            )} to your pocket or make active `,
          });
        }
      }
    } catch (e) {
      console.log(`e`, e);
      this.setState({
        stage: STAGE_ERROR,
        txBody: null,
        errorMessage: e.toString(),
      });
    }
  };

  confirmTx = async () => {
    const { update } = this.props;
    if (this.state.txHash !== null) {
      this.setState({ stage: STAGE_CONFIRMING });
      const data = await getTxs(this.state.txHash);
      if (data !== null) {
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
      contentHash: '',
      txHeight: null,
      txHash: null,
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

  onClickBtnRank = async () => {
    const { addressLocalStor } = this.state;
    const { rankLink } = this.props;
    if (rankLink !== null) {
      await this.setState({
        contentHash: rankLink,
      });
    }

    if (addressLocalStor.keys === 'keplr') {
      this.onClickInitKeplr();
    }
  };

  onClickInit = () => {
    const { addressLocalStor } = this.state;

    if (addressLocalStor.keys === 'keplr') {
      this.onClickInitKeplr();
    }
  };

  render() {
    const {
      contentHash,
      stage,
      txHeight,
      txHash,
      errorMessage,
      file,
      addressLocalStor,
    } = this.state;

    const { textBtn, placeholder, rankLink } = this.props;

    if (stage === STAGE_INIT && addressLocalStor === null) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <LinkRoute
              style={{
                paddingTop: 10,
                margin: '0 15px',
                paddingBottom: 10,
                display: 'block',
              }}
              className="btn"
              to="/"
            >
              Connect
            </LinkRoute>
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_INIT && rankLink && rankLink !== null) {
      let keys = 'ledger';
      if (addressLocalStor !== null) {
        keys = addressLocalStor.keys;
      }
      return (
        <ActionBar>
          <ActionBarContentText>
            <ButtonImgText
              text={
                <Pane alignItems="center" display="flex">
                  Rank{' '}
                  <img
                    src={imgCyber}
                    alt="cyber"
                    style={{
                      width: 20,
                      height: 20,
                      marginLeft: '5px',
                      paddingTop: '2px',
                    }}
                  />
                </Pane>
              }
              onClick={() => this.onClickBtnRank()}
              img={keys === 'ledger' ? imgLedger : imgKeplr}
            />
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (stage === STAGE_INIT) {
      return (
        <StartStageSearchActionBar
          textBtn={textBtn || 'Cyberlink'}
          keys={addressLocalStor !== null ? addressLocalStor.keys : false}
          onClickBtn={this.onClickInit}
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
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default withIpfsAndKeplr(connect(mapStateToProps)(ActionBarContainer));
