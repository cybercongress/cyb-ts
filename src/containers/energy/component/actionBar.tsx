import { useEffect, useState } from 'react';
import { ActionBar as ActionBarContainer, Tab } from '@cybercongress/gravity';
import { coin } from '@cosmjs/launchpad';
import { Link, useNavigate } from 'react-router-dom';
import { useSigningClient } from 'src/contexts/signerClient';
import {
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
  Account,
  ButtonIcon,
  Button,
  ActionBar as ActionBarCenter,
  Input,
} from '../../../components';
import {
  LEDGER,
  PATTERN_CYBER,
  PATTERN_CYBER_CONTRACT,
  DEFAULT_GAS_LIMITS,
} from '../../../utils/config';
import { getTxs } from '../../../utils/search/utils';
import { ValueImg } from '../ui';
import { routes } from '../../../routes';

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

function Btn({ onSelect, checkedSwitch, text, ...props }) {
  return (
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
}

function ActionBarSteps({
  children,
  btnText,
  onClickFnc,
  onClickBack,
  disabled,
}) {
  return (
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
      {btnText && (
        <Button disabled={disabled} onClick={onClickFnc}>
          {btnText}
        </Button>
      )}
    </ActionBarContainer>
  );
}

function ActionBar({ selected, updateFnc, addressActive, selectedRoute }) {
  const navigate = useNavigate();
  const { signer, signingClient } = useSigningClient();
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recipientInputValid, setRecipientInputValid] = useState(null);
  const [addressAddRouteInput, setAddressAddRouteInput] = useState('');
  const [aliasInput, setAliasInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [selectResource, setSelectResource] = useState('milliampere');

  useEffect(() => {
    const confirmTx = async () => {
      if (txHash !== null) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txHash]);

  useEffect(() => {
    if (addressAddRouteInput !== '') {
      if (
        addressAddRouteInput.match(PATTERN_CYBER) ||
        addressAddRouteInput.match(PATTERN_CYBER_CONTRACT)
      ) {
        setRecipientInputValid(null);
      } else {
        setRecipientInputValid('Invalid bech32 address');
      }
    }
  }, [addressAddRouteInput]);

  const clearState = () => {
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
    if (signer && signingClient) {
      try {
        const [{ address }] = await signer.getAccounts();
        if (addressActive === address) {
          let response = {};
          const fee = {
            amount: [],
            gas: DEFAULT_GAS_LIMITS.toString(),
          };
          if (stage === STAGE_ADD_ROUTER) {
            setStage(STAGE_SUBMITTED);
            response = await signingClient.createEnergyRoute(
              address,
              addressAddRouteInput,
              aliasInput,
              fee
            );
          }
          if (stage === STAGE_SET_ROUTER) {
            setStage(STAGE_SUBMITTED);
            response = await signingClient.editEnergyRoute(
              address,
              selectedRoute.destination,
              coin(parseFloat(amountInput) * 10 ** 3, selectResource),
              fee
            );
          }
          if (stage === STAGE_DELETE_ROUTER) {
            setStage(STAGE_SUBMITTED);
            response = await signingClient.deleteEnergyRoute(
              address,
              selectedRoute.destination,
              fee
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
          <Link style={{ marginLeft: 5 }} to="/">
            your pocket
          </Link>
          .
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (!signingClient && !signer) {
    return (
      <ActionBarContainer>
        <Dots big />
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_INIT && selected === 'myEnegy') {
    return (
      <ActionBarCenter
        button={{
          text: 'Investmint',
          link: routes.hfr.path,
        }}
      />
    );
  }

  if (
    stage === STAGE_INIT &&
    selected === 'outcome' &&
    Object.keys(selectedRoute).length === 0
  ) {
    return (
      <ActionBarCenter
        button={{
          onClick: () => setStage(STAGE_ADD_ROUTER),
          text: 'Add Route',
        }}
      />
    );
  }

  if (
    stage === STAGE_INIT &&
    selected === 'outcome' &&
    Object.keys(selectedRoute).length > 0
  ) {
    return (
      <ActionBarCenter>
        <Button
          style={{
            margin: '0 10px',
          }}
          onClick={() => setStage(STAGE_SET_ROUTER)}
        >
          Set Route
        </Button>
        <Button
          style={{
            margin: '0 10px',
          }}
          onClick={() => setStage(STAGE_DELETE_ROUTER)}
        >
          Delete Route
        </Button>
      </ActionBarCenter>
    );
  }

  if (stage === STAGE_ADD_ROUTER) {
    return (
      <ActionBarSteps
        disabled={aliasInput.length === 0}
        onClickFnc={generationTxs}
        onClickBack={() => setStage(STAGE_INIT)}
        btnText="Add Router"
      >
        <Input
          value={addressAddRouteInput}
          style={{
            marginRight: 10,
          }}
          width="300px"
          onChange={(e) => setAddressAddRouteInput(e.target.value)}
          placeholder="address"
          // isInvalid={recipientInputValid !== null}
          error={recipientInputValid}
        />
        &nbsp;
        <Input
          value={aliasInput}
          width="24%"
          onChange={(e) => setAliasInput(e.target.value)}
          placeholder="alias"
        />
      </ActionBarSteps>
    );
  }

  if (stage === STAGE_SET_ROUTER) {
    return (
      <ActionBarCenter
        button={{
          text: 'Set Router',
          disabled: amountInput.length === 0,
          onClick: generationTxs,
        }}
        onClickBack={() => setStage(STAGE_INIT)}
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
          text={<ValueImg text="milliampere" />}
          checkedSwitch={selectResource === 'milliampere'}
          onSelect={() => setSelectResource('milliampere')}
        />
        <Btn
          text={<ValueImg text="millivolt" />}
          checkedSwitch={selectResource === 'millivolt'}
          onSelect={() => setSelectResource('millivolt')}
        />
      </ActionBarCenter>
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
        onClickBtnClose={() => clearState()}
      />
    );
  }

  if (stage === STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError
        errorMessage={errorMessage}
        onClickBtn={() => clearState()}
      />
    );
  }

  return null;
}

export default ActionBar;
