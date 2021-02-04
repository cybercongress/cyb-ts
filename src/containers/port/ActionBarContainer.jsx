import React, { Component } from 'react';
import { ActionBar, Button, Input, Pane } from '@cybercongress/gravity';
import { PATTERN_CYBER } from '../../utils/config';

const ADDR_ETH = '0xd56bd28501f90ba21557b3d2549f1b6e14952303';

const hopefully = ($) => (error, result) => {
  if (error) {
    console.log('error', error);
  } else {
    $(result);
  }
};

const ping = (tx, web3) =>
  new Promise((resolve, reject) => {
    loop();
    function loop() {
      web3.eth.getTransaction(tx, async (error, receipt) => {
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

const ContributeETH = ({
  onClickBtn,
  valueAmount,
  onChangeAmount,
  disabledBtnConfirm,
  validAmount,
  messageAmount,
}) => (
  <ActionBar>
    <ActionBarContentText>
      I want to contribute
      <Input
        value={valueAmount}
        onChange={onChangeAmount}
        // placeholder={`сhoose round ${minValueRound} to ${maxValueRound}`}
        isInvalid={validAmount}
        message={messageAmount}
        marginLeft={15}
        marginRight={5}
        width="150px"
        textAlign="end"
        // style={{
        //   width: '15%',
        //   margin: '0 5px 0 15px'
        // }}
      />
      <span>ETH</span>
    </ActionBarContentText>
    <Button disabled={disabledBtnConfirm} onClick={onClickBtn}>
      Confirm
    </Button>
  </ActionBar>
);

const CyberAddress = ({
  disabledBtnConfirm,
  onClickBtn,
  validInputCyberAddress,
  messageCyberAddress,
  cyberAddress,
  onChange,
}) => (
  <ActionBar>
    <ActionBarContentText>
      <span>cyber address</span>
      <Input
        value={cyberAddress}
        onChange={onChange}
        // placeholder={`сhoose round ${minValueRound} to ${maxValueRound}`}
        isInvalid={validInputCyberAddress}
        message={messageCyberAddress}
        width="250px"
        marginLeft={15}
        marginRight={10}
        textAlign="end"
        // style={{
        //   width: '10%',
        //   margin: '0 10px 0 15px'
        // }}
      />
    </ActionBarContentText>
    <Button disabled={disabledBtnConfirm} onClick={onClickBtn}>
      Confirm
    </Button>
  </ActionBar>
);

const Succesfuuly = ({ onClickBtn, hash }) => (
  <ActionBar>
    <ActionBarContentText flexDirection="column">
      <div className="text-default">
        Your TX has been broadcast to the network. It is waiting to be mined &
        confirmed.
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

class ActionBarAuction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'start',
      amount: '',
      tx: null,
      messageCyberAddress: '',
      messageAmount: '',
      validInputCyberAddress: false,
      validInputAmount: false,
      cyberAddress: '',
    };
  }

  onChangeCyberAddress = (e) => {
    this.setState({
      cyberAddress: e.target.value,
    });
  };

  onChangeAmount = (e) =>
    this.setState({
      amount: e.target.value,
    });

  onClickFuckGoogle = async () => {
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
          // console.log(accounts[0]);
          this.setState({
            step: 'start',
            cyberAddress: '',
          });
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        // console.log(accounts[0]);
        this.setState({
          step: 'start',
          cyberAddress: '',
        });
      }
    } else {
      return console.log('Your metamask is locked!');
    }
  };

  onClickSaveAddress = () => {
    this.setState({
      step: 'start',
      cyberAddress: '',
      amount: '',
    });
  };

  buyTOKEN = async (account) => {
    const { web3 } = this.props;
    const { cyberAddress, amount } = this.state;

    const encoded = Buffer.from(cyberAddress).toString('hex');
    const getData = `0x${encoded}`;

    const priceInWei = await web3.utils.toWei(amount, 'ether');
    // web3.eth.sendTransaction(
    //   {
    //     from: account,
    //     to: ADDR_ETH,
    //     value: priceInWei,
    //     data: getData,
    //   },
    //   hopefully((result) =>
    //     ping(result).then(() => {
    //       this.setState({
    //         step: 'succesfuuly',
    //         tx: result,
    //       });
    //     })
    //   )
    // );
    web3.eth
      .sendTransaction({
        from: account,
        to: ADDR_ETH,
        value: priceInWei,
        data: getData,
      })
      .on('transactionHash', (result) => {
        ping(result, web3).then(() => {
          this.setState({
            step: 'succesfuuly',
            tx: result,
          });
        });
      });
  };

  onClickContribute = async () => {
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
          // console.log(accounts[0]);
          this.buyTOKEN(accounts[0]);
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        // console.log(accounts[0]);
        this.buyTOKEN(accounts[0]);
      }
    } else {
      return console.log('Your metamask is locked!');
    }
  };

  onClickTransactionCost = () =>
    this.setState({
      step: 'succesfuuly',
    });

  validAmountFunc = (number) => {
    const amount = parseFloat(number);
    if (isNaN(amount)) {
      return false;
    }
    if (amount > 0) {
      return true;
    }
    return false;
  };

  render() {
    const {
      step,
      cyberAddress,
      amount,
      tx,
      messageCyberAddress,
      messageAmount,
      validInputCyberAddress,
      validInputAmount,
    } = this.state;
    const { web3, accounts } = this.props;

    if (web3.givenProvider === null) {
      return (
        <ActionBar>
          <ActionBarContentText>
            <span>Please install the</span>
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

    if (accounts === undefined && web3.givenProvider !== null) {
      return (
        <ActionBar>
          <Button onClick={this.onClickFuckGoogle}>Connect account</Button>
        </ActionBar>
      );
    }

    if (step === 'start') {
      return (
        <ContributeETH
          valueAmount={amount}
          validAmount={validInputAmount}
          messageAmount={messageAmount}
          onChangeAmount={(e) => this.onChangeAmount(e)}
          onClickBtn={() => this.setState({ step: 'CyberAddress' })}
          disabledBtnConfirm={!this.validAmountFunc(amount)}
        />
      );
    }

    if (step === 'CyberAddress') {
      return (
        <CyberAddress
          cyberAddress={cyberAddress}
          validInputCyberAddress={validInputCyberAddress}
          messageCyberAddress={messageCyberAddress}
          onChange={(e) => this.onChangeCyberAddress(e)}
          onClickBtn={this.onClickContribute}
          disabledBtnConfirm={!cyberAddress.match(PATTERN_CYBER)}
        />
      );
    }

    if (step === 'succesfuuly') {
      return <Succesfuuly hash={tx} onClickBtn={this.onClickSaveAddress} />;
    }

    return null;
  }
}

export default ActionBarAuction;
