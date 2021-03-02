import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActionBar, Button, Input, Pane } from '@cybercongress/gravity';
import { CYBER, PATTERN_CYBER } from '../../utils/config';
import { formatNumber, trimString } from '../../utils/utils';
import { pingTx } from './utils';
import { LinkWindow } from '../../components';
import ActionBarConnect from './ActionBarConnect';

const ADDR_ETH = '0xd56bd28501f90ba21557b3d2549f1b6e14952303';

const ActionBarSteps = ({ text, btnText, onClickFnc }) => (
  <ActionBar>
    <ActionBarContentText>{text}</ActionBarContentText>
    <Button onClick={onClickFnc}>{btnText}</Button>
  </ActionBar>
);

const CardPackage = ({
  eth = 0,
  title = '',
  gcyb = 0,
  selected = false,
  ...props
}) => (
  <Pane
    className="cardVisaActionBar"
    borderRadius="5px"
    boxShadow="0 0 5px #3ab793"
    backgroundColor={selected ? '#3ab793' : '#000'}
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
        Congrats! After tx{' '}
        <LinkWindow to={`https://etherscan.io/tx/${hash}`}>
          {trimString(hash, 7, 7)}
        </LinkWindow>{' '}
        confirmation you will immediately receive 98 EUL for playing{' '}
        <Link to="/gol">Game of Links</Link>
      </div>
    </ActionBarContentText>
    <Button onClick={onClickBtn}>Play</Button>
  </ActionBar>
);

function ActionBarAuction({ web3, accountsETH, visa, pocketAddress }) {
  const [step, setStep] = useState('start');
  const [messageCyberAddress, setMessageCyberAddress] = useState('');
  const [validInputCyberAddress, setValidInputCyberAddress] = useState(false);
  const [cyberAddress, setCyberAddress] = useState('');
  const [selected, setSelected] = useState('');
  const [tx, setTx] = useState(null);

  useEffect(() => {
    if (
      pocketAddress.cyber.bech32 !== null &&
      pocketAddress.cyber.bech32.match(PATTERN_CYBER)
    ) {
      setCyberAddress(pocketAddress.cyber.bech32);
    }
  }, [pocketAddress.cyber]);

  const onClickFuckGoogle = async () => {
    if (web3.currentProvider.host) {
      return console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          setStep('start');
          setCyberAddress('');
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        setStep('start');
        setCyberAddress('');
      }
    } else {
      return console.log('Your metamask is locked!');
    }
  };

  const onClickSaveAddress = () => {
    setStep('start');
    setSelected('');
  };

  const buyTOKEN = async (account) => {
    const encoded = Buffer.from(cyberAddress).toString('hex');
    const getData = `0x${encoded}`;

    const priceInWei = await web3.utils.toWei(
      visa[selected].eth.toString(),
      'ether'
    );

    web3.eth
      .sendTransaction({
        from: account,
        to: ADDR_ETH,
        value: priceInWei,
        data: getData,
      })
      .on('transactionHash', (result) => {
        pingTx(result, web3).then(() => {
          setStep('succesfuuly');
          setTx(result);
        });
      });
  };

  const onClickContribute = async () => {
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
          buyTOKEN(accounts[0]);
        }
      } catch (error) {
        console.log('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        // console.log(accounts[0]);
        buyTOKEN(accounts[0]);
      }
    } else {
      return console.log('Your metamask is locked!');
    }
  };

  const selectFnc = (cardSelect) => {
    setSelected(cardSelect);
    setStep('CyberAddress');
  };

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

  if (accountsETH == null && web3.givenProvider !== null) {
    return (
      <ActionBar>
        <Button onClick={onClickFuckGoogle}>Connect web3</Button>
      </ActionBar>
    );
  }

  if (step === 'start') {
    return (
      <ActionBar>
        <ActionBarContentText justifyContent="space-evenly">
          {Object.keys(visa).map((key) => (
            <CardPackage
              key={key}
              onClick={() => selectFnc(key)}
              selected={selected === key}
              title={key}
              eth={visa[key].eth}
              gcyb={formatNumber(visa[key].gcyb, 3)}
            />
          ))}
        </ActionBarContentText>
      </ActionBar>
    );
  }

  if (pocketAddress.eth.bech32 === null) {
    return <ActionBarConnect web3={web3} selectNetwork="eth" />;
  }

  if (pocketAddress.cyber.bech32 === null) {
    return <ActionBarConnect selectNetwork="cyber" />;
  }

  // if (step === 'CyberAddress' && pocketAddress.cyber.bech32 === null) {
  //   return (
  //     <ActionBar>
  //       <ActionBarContentText justifyContent="space-evenly">
  //         Connect Cyber
  //       </ActionBarContentText>
  //       <Button onClick={onClickFuckGoogle}>Connect</Button>
  //     </ActionBar>
  //   );
  // }

  if (step === 'CyberAddress') {
    return (
      <CyberAddress
        cyberAddress={cyberAddress}
        validInputCyberAddress={validInputCyberAddress}
        messageCyberAddress={messageCyberAddress}
        onChange={(e) => setCyberAddress(e.target.value)}
        onClickBtn={() => setStep('Donate')}
        disabledBtnConfirm={!cyberAddress.match(PATTERN_CYBER)}
      />
    );
  }

  if (step === 'Donate') {
    return (
      <ActionBarSteps
        text={`You are going to make ${visa[selected].eth} ETH of 
      irreversible donation to cyberCongress`}
        btnText="Donate"
        onClickFnc={() => setStep('allocationCyb')}
      />
    );
  }

  if (step === 'allocationCyb') {
    return (
      <ActionBarSteps
        text={`For this donation you will have an 
      allocation of ${formatNumber(
        Math.floor(visa[selected].gcyb * CYBER.DIVISOR_CYBER_G)
      )} CYB tokens in Genesis`}
        btnText="Confirm"
        onClickFnc={() => setStep('thatCyberCongress')}
      />
    );
  }
  if (step === 'thatCyberCongress') {
    return (
      <ActionBarSteps
        text="I agree that cyberCongress will use donations at its own discretion"
        btnText="Agree"
        onClickFnc={() => setStep('dontTrust')}
      />
    );
  }

  if (step === 'dontTrust') {
    return (
      <ActionBarSteps
        text={`I accept that the software is distributed under "Don't trust, don't fear, don't beg" license`}
        btnText="Accept"
        onClickFnc={() => setStep('understandThat')}
      />
    );
  }

  if (step === 'understandThat') {
    return (
      <ActionBarSteps
        text="I understand that the Genesis date is unknown and may never happen without a community effort"
        btnText="Understand"
        onClickFnc={() => setStep('iSwearIwill')}
      />
    );
  }

  if (step === 'iSwearIwill') {
    return (
      <ActionBarSteps
        text="I swear I will always use CYB tokens with the nonviolence principle in mind"
        btnText="Swear"
        onClickFnc={() => setStep('promise')}
      />
    );
  }

  if (step === 'promise') {
    return (
      <ActionBarSteps
        text="I promise I will train Superintelligence for the benefit of all living things including our planet"
        btnText="Promise"
        onClickFnc={() => setStep('Sign')}
      />
    );
  }

  if (step === 'Sign') {
    return (
      <ActionBarSteps
        text="I am ready for change, give me Cyber citizenship"
        btnText="Sign"
        onClickFnc={onClickContribute}
      />
    );
  }

  if (step === 'succesfuuly') {
    return <Succesfuuly hash={tx} onClickBtn={onClickSaveAddress} />;
  }

  return null;
}

export default ActionBarAuction;
