import React, { Component } from 'react';
import { ActionBar, Button, Input, Pane } from '@cybercongress/gravity';
import { PATTERN_CYBER } from '../../utils/config';
import { formatNumber } from '../../utils/utils';

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

const CardPackage = ({
  eth = 0,
  title = '',
  gcyb = 0,
  selected = false,
  ...props
}) => (
  <Pane
    className="cardVisaActionBar"
    boxShadow={selected ? '0 0 7px 1px #3ab793' : '0 0 3px #3ab793'}
    {...props}
  >
    <Pane marginBottom={5}>{title}</Pane>
    <Pane fontSize="17px">
      {eth} ETH ~ {gcyb} GCYB{' '}
    </Pane>
  </Pane>
);

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
      amount: 0,
      tx: null,
      messageCyberAddress: '',
      messageAmount: '',
      validInputCyberAddress: false,
      validInputAmount: false,
      cyberAddress: '',
      selected: '',
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
      amount: 0,
      selected: '',
    });
  };

  buyTOKEN = async (account) => {
    const { web3 } = this.props;
    const { cyberAddress, amount } = this.state;

    const encoded = Buffer.from(cyberAddress).toString('hex');
    const getData = `0x${encoded}`;

    const priceInWei = await web3.utils.toWei(amount.toString(), 'ether');
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

  selectFnc = (cardSelect, eth) => {
    const { selected } = this.state;
    if (selected !== cardSelect) {
      this.setState({
        selected: cardSelect,
        amount: eth,
      });
    } else {
      this.setState({
        selected: '',
        amount: 0,
      });
    }
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
      selected,
    } = this.state;
    const { web3, accounts, visa } = this.props;

    console.log('visa', visa);

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
        // <ContributeETH
        //   valueAmount={amount}
        //   validAmount={validInputAmount}
        //   messageAmount={messageAmount}
        //   onChangeAmount={(e) => this.onChangeAmount(e)}
        //   onClickBtn={() => this.setState({ step: 'CyberAddress' })}
        //   disabledBtnConfirm={!this.validAmountFunc(amount)}
        // />
        <ActionBar>
          <ActionBarContentText justifyContent="space-evenly">
            <CardPackage
              onClick={() => this.selectFnc('tourist', visa.tourist.eth)}
              selected={selected === 'tourist'}
              title="Tourist"
              eth={visa.tourist.eth}
              gcyb={formatNumber(visa.tourist.gcyb, 3)}
            />
            <CardPackage
              onClick={() => this.selectFnc('citizen', visa.citizen.eth)}
              selected={selected === 'citizen'}
              title="Citizen"
              eth={visa.citizen.eth}
              gcyb={formatNumber(visa.citizen.gcyb, 3)}
            />
            <CardPackage
              onClick={() =>
                this.selectFnc('entrepreneur', visa.entrepreneur.eth)
              }
              selected={selected === 'entrepreneur'}
              title="Entrepreneur"
              eth={visa.entrepreneur.eth}
              gcyb={formatNumber(visa.entrepreneur.gcyb, 3)}
            />
          </ActionBarContentText>
          <Button
            onClick={() => this.setState({ step: 'CyberAddress' })}
            disabled={amount === 0}
          >
            Confirm
          </Button>
        </ActionBar>
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
