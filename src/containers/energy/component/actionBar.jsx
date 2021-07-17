import React, { useEffect, useState, useContext } from 'react';
import {
  ActionBar as ActionBarContainer,
  Button,
  Input,
  Tab,
} from '@cybercongress/gravity';
import { coin } from '@cosmjs/launchpad';
import { Link, useHistory } from 'react-router-dom';
import {
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
  Account,
  ButtonIcon,
} from '../../../components';
import { AppContext } from '../../../context';
import { CYBER, LEDGER, PATTERN_CYBER } from '../../../utils/config';
import { getTxs } from '../../../utils/search/utils';
import { ValueImg } from '../ui';

const back = require('../../../image/arrow-back-outline.svg');

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const STAGE_ADD_ROUTER = 2.1;
const STAGE_SET_ROUTER = 2.2;
const STAGE_DELETE_ROUTER = 2.3;

const Btn = ({ onSelect, checkedSwitch, text, ...props }) => (
  <Tab
    isSelected={checkedSwitch}
    onSelect={onSelect}
    color="#36d6ae"
    boxShadow="0px 0px 10px #36d6ae"
    minWidth="100px"
    marginX={0}
    paddingX={10}
    paddingY={10}
    fontSize="18px"
    height={42}
    {...props}
  >
    {text}
  </Tab>
);

const ActionBarSteps = ({
  children,
  btnText,
  onClickFnc,
  onClickBack,
  disabled,
}) => (
  <ActionBarContainer>
    {onClickBack && (
      <ButtonIcon
        style={{ padding: 0 }}
        img={back}
        onClick={onClickBack}
        text="previous step"
      />
    )}
    <ActionBarContentText marginLeft={onClickBack ? 30 : 0}>
      {children}
    </ActionBarContentText>
    <Button disabled={disabled} onClick={onClickFnc}>
      {btnText}
    </Button>
  </ActionBarContainer>
);

function ActionBar({ selected, updateFnc, addressActive, selectedRoute }) {
  const history = useHistory();
  const { keplr, jsCyber } = useContext(AppContext);
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recipientInputValid, setRecipientInputValid] = useState(null);
  const [addressAddRouteInput, setAddressAddRouteInput] = useState('');
  const [aliasInput, setAliasInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [selectResource, setSelectResource] = useState('volt');

  useEffect(() => {
    cleatState();
  }, [selectedRoute]);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await getTxs(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateFnc) {
              updateFnc();
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.raw_log);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  useEffect(() => {
    if (addressAddRouteInput !== '') {
      if (!addressAddRouteInput.match(PATTERN_CYBER)) {
        setRecipientInputValid('Invalid bech32 address');
      } else {
        setRecipientInputValid(null);
      }
    }
  }, [addressAddRouteInput]);

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(null);
    setTxHeight(null);
    setErrorMessage(null);
    setAliasInput('');
    setAmountInput('');
    setAddressAddRouteInput('');
    setRecipientInputValid('');
  };

  const generationTxs = async () => {
    if (keplr !== null) {
      try {
        const [{ address }] = await keplr.signer.getAccounts();
        if (addressActive === address) {
          let response = {};
          if (stage === STAGE_ADD_ROUTER) {
            setStage(STAGE_SUBMITTED);
            response = await keplr.createEnergyRoute(
              address,
              addressAddRouteInput,
              aliasInput
            );
          }
          if (stage === STAGE_SET_ROUTER) {
            setStage(STAGE_SUBMITTED);
            response = await keplr.editEnergyRoute(
              address,
              selectedRoute.destination,
              coin(parseFloat(amountInput), selectResource)
            );
          }
          if (stage === STAGE_DELETE_ROUTER) {
            setStage(STAGE_SUBMITTED);
            response = await keplr.deleteEnergyRoute(
              address,
              selectedRoute.destination
            );
          }

          console.log(`response`, response);
          if (response.code === 0) {
            setTxHash(response.transactionHash);
          } else {
            setTxHash(null);
            setErrorMessage(response.rawLog.toString());
            setStage(STAGE_ERROR);
          }
        } else {
          setErrorMessage(
            <span>
              Add address <Account margin="0 5px" address={address} /> to your
              pocket or make active{' '}
            </span>
          );
          setStage(STAGE_ERROR);
        }
      } catch (error) {
        console.log(error);
        setTxHash(null);
        setErrorMessage(error.toString());
        setStage(STAGE_ERROR);
      }
    }
  };

  if (addressActive === null) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          Start by adding a address to
          <Link style={{ marginLeft: 5 }} to="/pocket">
            your pocket
          </Link>
          .
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (jsCyber === null || keplr === null) {
    return (
      <ActionBarContainer>
        <Dots big />
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_INIT && selected === 'myEnegy') {
    return (
      <ActionBarContainer>
        <Button onClick={() => history.push('/mint')}>Investmint</Button>
      </ActionBarContainer>
    );
  }

  if (
    stage === STAGE_INIT &&
    selected === 'outcome' &&
    Object.keys(selectedRoute).length === 0
  ) {
    return (
      <ActionBarContainer>
        <Button onClick={() => setStage(STAGE_ADD_ROUTER)}>Add Route</Button>
      </ActionBarContainer>
    );
  }

  if (
    stage === STAGE_INIT &&
    selected === 'outcome' &&
    Object.keys(selectedRoute).length > 0
  ) {
    return (
      <ActionBarContainer>
        <Button marginX={10} onClick={() => setStage(STAGE_SET_ROUTER)}>
          Set Route
        </Button>
        <Button marginX={10} onClick={() => setStage(STAGE_DELETE_ROUTER)}>
          Delete Route
        </Button>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_ADD_ROUTER) {
    return (
      <ActionBarSteps
        disabled={
          !addressAddRouteInput.match(PATTERN_CYBER) || aliasInput.length === 0
        }
        onClickFnc={generationTxs}
        onClickBack={() => setStage(STAGE_INIT)}
        btnText="Add Router"
      >
        <Input
          value={addressAddRouteInput}
          height={42}
          marginRight={10}
          width="300px"
          onChange={(e) => setAddressAddRouteInput(e.target.value)}
          placeholder="address"
          isInvalid={recipientInputValid !== null}
          message={recipientInputValid}
        />

        <Input
          value={aliasInput}
          height={42}
          width="24%"
          onChange={(e) => setAliasInput(e.target.value)}
          placeholder="alias"
        />
      </ActionBarSteps>
    );
  }

  if (stage === STAGE_SET_ROUTER) {
    return (
      <ActionBarSteps
        disabled={amountInput.length === 0}
        onClickFnc={generationTxs}
        onClickBack={() => setStage(STAGE_INIT)}
        btnText="Set Router"
      >
        <Input
          value={amountInput}
          height={42}
          width="24%"
          onChange={(e) => setAmountInput(e.target.value)}
          placeholder="amount"
          marginRight={10}
        />
        <Btn
          text={<ValueImg text="V" />}
          checkedSwitch={selectResource === 'volt'}
          onSelect={() => setSelectResource('volt')}
        />
        <Btn
          text={<ValueImg text="A" />}
          checkedSwitch={selectResource === 'amper'}
          onSelect={() => setSelectResource('amper')}
        />
      </ActionBarSteps>
    );
  }

  if (stage === STAGE_DELETE_ROUTER) {
    return (
      <ActionBarSteps
        onClickFnc={generationTxs}
        onClickBack={() => setStage(STAGE_INIT)}
        btnText="Delete Router"
      >
        Delete energy route for{' '}
        {Object.keys(selectedRoute).length > 0 && (
          <Account address={selectedRoute.destination} margin="0 5px" />
        )}
      </ActionBarSteps>
    );
  }

  if (stage === STAGE_SUBMITTED) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          check the transaction <Dots big />
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_CONFIRMING) {
    return <TransactionSubmitted />;
  }

  if (stage === STAGE_CONFIRMED) {
    return (
      <Confirmed
        txHash={txHash}
        txHeight={txHeight}
        onClickBtnCloce={() => cleatState()}
      />
    );
  }

  if (stage === STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError
        errorMessage={errorMessage}
        onClickBtn={() => cleatState()}
      />
    );
  }

  return null;
}

export default ActionBar;
