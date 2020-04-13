import React, { Component } from 'react';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Input, ActionBar, Pane, Text, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import { COSMOS, LEDGER } from '../../utils/config';
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

const { ADDR_FUNDING, DEFAULT_GAS, DEFAULT_GAS_PRICE, DIVISOR_ATOM } = COSMOS;

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
  }

  componentWillUpdate() {
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

    const addressInfo = await ledger.getAccountInfo(address);

    this.setState({
      addressInfo,
      availableStake: parseFloat(addressInfo.balanceuAtom),
      stage: STAGE_READY,
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
      stage: STAGE_INIT,
    });
  };

  onClickTrackContribution = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });

    this.tryConnect().then(connect => {
      console.log('connect status', connect);
      this.setState({
        connect,
      });
      // if (connect === undefined) {
      //   this.onClickTrackContribution();
      // }
    });
  };

  onClickSaveAddress = () => {
    this.tryConnect().then(connect => {
      console.log('connect status', connect);
      if (connect === undefined) {
        this.onClickSaveAddress();
        return;
      }
      if (connect !== undefined) {
        this.setState({
          connect,
        });
        if (connect.app === false) {
          this.onClickSaveAddress();
        }
      }
      this.setState({
        connect,
      });
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
    } = this.state;

    // SELECT
    //
    // if (stage === STAGE_INIT) {
    //   return (
    //     <ActionBar>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         Custom transaction
    //       </Button>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         Donate with Ledger
    //       </Button>
    //     </ActionBar>
    //   );
    // }

    // CUSTOM FLOW
    //
    // 1.1
    //
    // if (stage === STAGE_INIT) {
    //   return (
    //     <ActionBar>
    //       <ActionBarContentText>
    //         You can send donations directly to cyber~Congress multisig only if you control private keys of sending account.
    //       </ActionBarContentText>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         I control
    //       </Button>
    //     </ActionBar>
    //   );
    // }

    // 1.2
    //
    // if (stage === STAGE_INIT) {
    //   return (
    //     <ActionBar>
    //       <ActionBarContentText>
    //         CYB will be allocated to sending addresses. All donations from custodial wallets, exchanges and banks will be lost.
    //       </ActionBarContentText>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         I understand
    //       </Button>
    //     </ActionBar>
    //   );
    // };

    // 1.3
    // Put to pocket
    // if (stage === STAGE_INIT) {
    //   return (
    //     <ActionBar>
    //       <ActionBarContentText>
    //         To track your donation provide your sending address{' '}
    //         <Input
    //           placeholder="address"
    //           maxWidth="170px"
    //           textAlign="end"
    //           marginLeft={10}
    //           autoFocus
    //           height={42}
    //           width="unset"
    //         />
    //       </ActionBarContentText>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         Track
    //       </Button>
    //     </ActionBar>
    //   );
    // }

    // 1.4
    //
    // if (stage === STAGE_INIT) {
    //   return (
    //     <ActionBar>
    //       <ActionBarContentText display="inline">
    //         <Pane display="inline">
    //           By donating ATOM you agree with donation terms defined in
    //         </Pane>{' '}
    //         <LinkWindow to="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ">
    //           Whitepaper
    //         </LinkWindow>{' '}
    //         <Pane display="inline">and</Pane>{' '}
    //         <LinkWindow to="https://cybercongress.ai/game-of-links/">
    //           Game of Links rules
    //         </LinkWindow>
    //         .
    //       </ActionBarContentText>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         I agree
    //       </Button>
    //     </ActionBar>
    //   );
    // }

    // // 1.5
    // //
    // if (stage === STAGE_INIT) {
    //   return (
    //     <ActionBar>
    //       <ActionBarContentText>
    //         Amazing, now you can send ATOMs
    //       </ActionBarContentText>
    //       <Button paddingX={10} marginX={10} onClick={this.onClickFuckGoogle}>
    //         Copy address
    //       </Button>
    //       <Button paddingX={10} marginX={10} onClick={this.onClickFuckGoogle}>
    //         Show address
    //       </Button>
    //       <Button paddingX={10} marginX={10} onClick={this.onClickFuckGoogle}>
    //         Download tx
    //       </Button>
    //     </ActionBar>
    //   );
    // }

    // // 1.6
    //
    // if (stage === STAGE_INIT) {
    //   return (
    //     <ActionBar>
    //       <ActionBarContentText>
    //         Now its time to choose your path
    //       </ActionBarContentText>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         Master
    //       </Button>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         Hero
    //       </Button>
    //       <Button marginX={10} onClick={this.onClickFuckGoogle}>
    //         Evangelist
    //       </Button>
    //     </ActionBar>
    //   );
    // }

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
        <SendAmount
          height={height50}
          onClickBtn={this.onClickTrackContribution}
          address={ADDR_FUNDING}
          onClickBtnCloce={this.onClickInitStage}
        />
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
          onClickBtn={this.onClickSaveAddress}
          status={connect}
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={this.onClickInitStage}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(version, LEDGER_VERSION_REQ)
          }
          address={ADDR_FUNDING}
        />
      );
    }

    if (stage === STAGE_READY && this.hasKey() && this.hasWallet()) {
      return (
        <ContributeATOMs
          onClickBtn={() => this.generateTx()}
          address={address.bech32}
          availableStake={
            Math.floor((availableStake / DIVISOR_ATOM) * 1000) / 1000
          }
          gasUAtom={gas * gasPrice}
          gasAtom={(gas * gasPrice) / DIVISOR_ATOM}
          onChangeInput={e => this.onChangeInputContributeATOMs(e)}
          valueInput={toSend}
          onClickBtnCloce={this.onClickInitStage}
          onClickMax={this.onClickMax}
        />
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

export default ActionBarTakeOff;
