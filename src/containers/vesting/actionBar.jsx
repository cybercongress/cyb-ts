import React, { Component } from 'react';
import { ActionBar, Button, Input, Pane } from '@cybercongress/gravity';
import { AUCTION, PATTERN_CYBER, CYBER } from '../../utils/config';

function lament(error) {
  if (error) {
    document.querySelector('.before-error').outerHTML += `
      <div class="error pane">
        <h3>${error.message}</h3>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}

const hopefully = $ => (error, result) => {
  if (error) {
    lament(error);
  } else {
    $(result);
  }
};

const ping = tx =>
  new Promise((resolve, reject) => {
    loop();
    function loop() {
      window.web3.eth.getTransactionReceipt(tx, async (error, receipt) => {
        if (receipt == null) {
          resolve(receipt);
        } else {
          setTimeout(loop, 1000);
        }

        if (receipt) {
          resolve(receipt);
        } else {
          setTimeout(loop, 1000);
        }
      });
    }
  });

const ActionBarContentText = ({ children, ...props }) => (
  <Pane
    display="flex"
    fontSize="20px"
    justifyContent="center"
    alignItems="center"
    flexGrow={1}
    marginRight="15px"
    {...props}
  >
    {children}
  </Pane>
);

const GenerateTx = ({ onClickBtn, valueAmount, account }) => (
  <ActionBar>
    <ActionBarContentText>
      Vest {valueAmount}
      {AUCTION.TOKEN_NAME}s till the end of action and create proposal to claim{' '}
      {valueAmount}
      {CYBER.DENOM_CYBER.toUpperCase()}s to account {account}
    </ActionBarContentText>
    <Button onClick={onClickBtn}>GenerateTx</Button>
  </ActionBar>
);

const Succesfuuly = ({ onClickBtn, hash }) => (
  <ActionBar>
    <ActionBarContentText flexDirection="column">
      <div className="text-default">
        Your TX has been broadcast to the network. It is waiting to be mined &
        confirned.
      </div>
      <div className="text-default">
        Check TX status:{' '}
        <a
          className="hash"
          href={`https://etherscan.io/tx/${hash}`}
          target="_blank"
        >
          {hash}
        </a>
      </div>
    </ActionBarContentText>
    <Button onClick={onClickBtn}>OK</Button>
  </ActionBar>
);

const CreateVesting = ({
  onClickBtn,
  valueAddr,
  valueAmount,
  onChangeAmount,
  onChangeAddr,
  disabledBtnCreateVesting,
  validAmount,
  validAddr,
  messageAddr,
  messageAmount,
}) => (
  <ActionBar>
    <ActionBarContentText>
      Vest
      <Input
        value={valueAmount}
        onChange={onChangeAmount}
        isInvalid={validAmount}
        message={messageAmount}
        marginLeft={15}
        marginRight={5}
        width="11%"
        textAlign="end"
      />
      <span>{AUCTION.TOKEN_NAME}s to account</span>
      <Input
        value={valueAddr}
        onChange={onChangeAddr}
        isInvalid={validAddr}
        message={messageAddr}
        width="30%"
        marginLeft={15}
        marginRight={10}
      />
    </ActionBarContentText>
    <Button disabled={disabledBtnCreateVesting} onClick={onClickBtn}>
      Get EUL
    </Button>
  </ActionBar>
);

class ActionBarVesting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'start',
      valueAddr: '',
      valueAmount: '',
      tx: null,
    };
    this.smart = AUCTION.ADDR_SMART_CONTRACT;
  }

  componentDidMount() {
    const { available } = this.props;

    const data = localStorage.getItem('ledger');
    if (data !== null) {
      const address = JSON.parse(data);

      this.setState({
        valueAddr: address.bech32,
      });
    }

    this.setState({
      valueAmount: available,
    });
  }

  onClickLook = async accounts => {
    const { web3, contractVesting } = this.props;
    const { valueAmount, valueAddr } = this.state;

    // const accountsCyber = 'cyber1gw5kdey7fs9wdh05w66s0h4s24tjdvtcp5fhky';

    const getData = await contractVesting.methods
      .lock(valueAmount, valueAddr)
      .encodeABI();
    console.log(getData);
    try {
      web3.eth.sendTransaction(
        {
          from: accounts,
          to: AUCTION.ADDR_VESTING,
          data: getData,
        },
        hopefully(result =>
          ping(result).then(() => {
            this.setState({
              step: 'succesfuuly',
              tx: result,
            });
          })
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  onClickGenerateTx = async () => {
    const { web3 } = this.props;
    if (web3.currentProvider.host) {
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          this.onClickLook(accounts[0]);
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        this.onClickLook(accounts[0]);
      }
    } else {
      return console.log('Your metamask is locked!');
    }
  };

  onClickSaveAddress = () => {
    const { update } = this.props;
    this.setState({
      step: 'start',
      valueAddr: '',
      valueAmount: '',
      tx: null,
    });
    if (update) {
      update();
    }
  };

  onClickTransactionCost = () =>
    this.setState({
      step: 'succesfuuly',
    });

  onChangeAmount = e =>
    this.setState({
      valueAmount: e.target.value,
    });

  onChangeAddr = e =>
    this.setState({
      valueAddr: e.target.value,
    });

  onClickCreateVesting = () => {
    this.setState({
      step: 'generateTx',
    });
  };

  render() {
    const { step, tx, valueAmount, valueAddr } = this.state;
    const { web3, available, endTime } = this.props;
    const btnCreateVesting =
      valueAmount > 0 &&
      valueAddr.match(PATTERN_CYBER) &&
      valueAmount <= parseFloat(available);

    if (endTime !== null) {
      return (
        <ActionBar>
          <ActionBarContentText>Vecting end {endTime}</ActionBarContentText>
        </ActionBar>
      );
    }

    if (web3.givenProvider === null) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <span>Please install</span>
            &nbsp;
            <a href="https://metamask.io/" target="_blank">
              Metamask extension
            </a>
            &nbsp;
            <span>and refresh the page</span>
          </ActionBarContentText>
        </ActionBar>
      );
    }

    if (step === 'start') {
      return (
        <CreateVesting
          valueAmount={valueAmount}
          onClickBtn={this.onClickCreateVesting}
          valueAddr={valueAddr}
          onChangeAmount={e => this.onChangeAmount(e)}
          onChangeAddr={e => this.onChangeAddr(e)}
          disabledBtnCreateVesting={!btnCreateVesting}
        />
      );
    }

    if (step === 'generateTx') {
      return (
        <GenerateTx
          valueAmount={valueAmount}
          account={valueAddr}
          onClickBtn={this.onClickGenerateTx}
        />
      );
    }

    if (step === 'succesfuuly') {
      return <Succesfuuly hash={tx} onClickBtn={this.onClickSaveAddress} />;
    }

    return null;
  }
}

export default ActionBarVesting;
