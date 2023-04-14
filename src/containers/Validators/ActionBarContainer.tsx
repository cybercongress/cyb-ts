import { useState, useEffect, useMemo } from 'react';
import { Pane, Text, ActionBar, Button } from '@cybercongress/gravity';
import { coin } from '@cosmjs/launchpad';
import { useNavigate } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import {
  Confirmed,
  TransactionSubmitted,
  Delegate,
  ReDelegate,
  TransactionError,
  Dots,
  ActionBar as ActionBarCenter,
} from '../../components';

import { trimString } from '../../utils/utils';

import { LEDGER, CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import useGetPassportByAddress from '../sigma/hooks/useGetPassportByAddress';
import { useQueryClient } from 'src/contexts/queryClient';
import { useSigningClient } from 'src/contexts/signerClient';

const {
  STAGE_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
} = LEDGER;

const fee = {
  amount: [],
  gas: (DEFAULT_GAS_LIMITS * 2).toString(),
};
const TXTYPE_DELEGATE = 0;
const TXTYPE_UNDELEGATE = 1;
const TXTYPE_REDELEGATE = 2;
const LEDGER_GENERATION = 23;

function ActionBarContentText({ children, ...props }) {
  return (
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
}

function StatusTx({ stage, cleatState, errorMessage, txHash, txHeight }) {
  if (stage === LEDGER_GENERATION) {
    return (
      <ActionBar>
        <ActionBarContentText>
          tx generation <Dots big />
        </ActionBarContentText>
      </ActionBar>
    );
  }

  if (stage === STAGE_WAIT) {
    return (
      <ActionBar>
        <ActionBarContentText>
          approve tx
          <Dots big />
        </ActionBarContentText>
      </ActionBar>
    );
  }

  if (stage === STAGE_SUBMITTED || stage === STAGE_CONFIRMING) {
    return <TransactionSubmitted />;
  }

  if (stage === STAGE_CONFIRMED) {
    return (
      <Confirmed
        txHash={txHash}
        txHeight={txHeight}
        onClickBtnCloce={cleatState}
      />
    );
  }

  if (stage === STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError errorMessage={errorMessage} onClickBtn={cleatState} />
    );
  }

  return null;
}

const getValidatorAddres = (validators) => {
  let validatorAddres = null;
  if (validators.operatorAddress) {
    validatorAddres = validators.operatorAddress;
  }
  if (validators.operator_address) {
    validatorAddres = validators.operator_address;
  }

  return validatorAddres;
};

const checkAddress = (addressPocket, addressKeplr, updateState) => {
  if (addressPocket !== null && addressPocket.bech32 === addressKeplr) {
    return true;
  }
  const { setStage, setErrorMessage } = updateState;
  const trimAdd = trimString(addressKeplr, 9, 5);
  setStage(STAGE_ERROR);
  setErrorMessage(`Add address ${trimAdd} to your pocket or make active `);
  return false;
};

const checkTxs = (response, updateState) => {
  console.log('response', response);
  const { setStage, setTxHash, setErrorMessage } = updateState;
  if (response.code === 0) {
    const hash = response.transactionHash;
    console.log('hash :>> ', hash);
    setStage(STAGE_SUBMITTED);
    setTxHash(hash);
  } else {
    setStage(STAGE_ERROR);
    setTxHash(null);
    setErrorMessage(response.rawLog.toString());
  }
};

const useCheckStatusTx = (txHash, setStage, setErrorMessage, updateFnc) => {
  const queryClient = useQueryClient();
  const [txHeight, setTxHeight] = useState(null);

  useEffect(() => {
    const confirmTx = async () => {
      if (queryClient && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await queryClient.getTx(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
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
            setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, txHash]);

  return { txHeight };
};

function ActionBarContainer({
  addressPocket,
  validators,
  validatorsAll,
  balance,
  loadingBalanceInfo,
  balanceToken,
  unStake,
  updateFnc,
}) {
  const { passport } = useGetPassportByAddress(addressPocket);
  const { signer, signingClient } = useSigningClient();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [stage, setStage] = useState(STAGE_INIT);
  const [txType, setTxType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [amount, setAmount] = useState('');
  const [valueSelect, setValueSelect] = useState('');
  const { txHeight } = useCheckStatusTx(
    txHash,
    setStage,
    setErrorMessage,
    updateFnc
  );

  const errorState = (error) => {
    setTxHash(null);
    setStage(STAGE_ERROR);
    setErrorMessage(error.toString());
  };

  const clearFunc = () => {
    setTxHash(null);
    setAmount('');
    setValueSelect('');
    setErrorMessage(null);
    setTxType(null);
    setStage(STAGE_INIT);
  };

  const delegateTokens = async () => {
    if (signer && signingClient) {
      try {
        const [{ address: addressKeplr }] = await signer.getAccounts();
        const validatorAddres = getValidatorAddres(validators);
        if (
          checkAddress(addressPocket, addressKeplr, {
            setErrorMessage,
            setStage,
          })
        ) {
          setStage(STAGE_WAIT);
          const response = await signingClient.delegateTokens(
            addressKeplr,
            validatorAddres,
            coin(parseFloat(amount), CYBER.DENOM_CYBER),
            fee,
            CYBER.MEMO_KEPLR
          );
          checkTxs(response, { setTxHash, setErrorMessage, setStage });
        }
      } catch (error) {
        errorState(error);
      }
    }
  };

  const undelegateTokens = async () => {
    if (signer && signingClient) {
      try {
        const [{ address: addressKeplr }] = await signer.getAccounts();

        const validatorAddres = getValidatorAddres(validators);
        if (
          checkAddress(addressPocket, addressKeplr, {
            setErrorMessage,
            setStage,
          })
        ) {
          setStage(STAGE_WAIT);
          const response = await signingClient.undelegateTokens(
            addressKeplr,
            validatorAddres,
            coin(parseFloat(amount), CYBER.DENOM_CYBER),
            fee,
            CYBER.MEMO_KEPLR
          );
          checkTxs(response, { setTxHash, setErrorMessage, setStage });
        }
      } catch (error) {
        errorState(error);
      }
    }
  };

  const redelegateTokens = async () => {
    if (signer && signingClient) {
      try {
        const [{ address: addressKeplr }] = await signer.getAccounts();
        if (
          checkAddress(addressPocket, addressKeplr, {
            setErrorMessage,
            setStage,
          })
        ) {
          setStage(STAGE_WAIT);
          const validatorAddres = getValidatorAddres(validators);
          const response = await signingClient.redelegateTokens(
            addressKeplr,
            validatorAddres,
            valueSelect,
            coin(parseFloat(amount), CYBER.DENOM_CYBER),
            fee,
            CYBER.MEMO_KEPLR
          );
          checkTxs(response, { setTxHash, setErrorMessage, setStage });
        }
      } catch (error) {
        errorState(error);
      }
    }
  };

  const claimRewards = async () => {
    if (signer && signingClient && queryClient) {
      try {
        const [{ address: addressKeplr }] = await signer.getAccounts();
        const validatorAddress = [];
        if (
          checkAddress(addressPocket, addressKeplr, {
            setErrorMessage,
            setStage,
          })
        ) {
          setStage(LEDGER_GENERATION);
          const delegationTotalRewards =
            await queryClient.delegationTotalRewards(addressKeplr);
          if (
            delegationTotalRewards !== null &&
            delegationTotalRewards.rewards
          ) {
            const { rewards } = delegationTotalRewards;
            Object.keys(rewards).forEach((key) => {
              if (rewards[key].reward !== null) {
                validatorAddress.push(rewards[key].validatorAddress);
              }
            });
            const gasLimitsRewards =
              150000 * Object.keys(validatorAddress).length;
            const feeRewards = {
              amount: [],
              gas: gasLimitsRewards.toString(),
            };
            setStage(STAGE_WAIT);
            const response = await signingClient.withdrawAllRewards(
              addressKeplr,
              validatorAddress,
              feeRewards
            );
            checkTxs(response, { setTxHash, setErrorMessage, setStage });
          }
        }
      } catch (error) {
        errorState(error);
      }
    }
  };

  const funcSetTxType = (type) => {
    setTxType(type);
    setStage(STAGE_READY);
  };

  // console.log('addressPocket', addressPocket);
  // console.log('loadingBalanceInfo', loadingBalanceInfo);
  // console.log('balance', balance);
  // console.log('balanceToken', balanceToken);
  // console.log('validators', validators);

  const validRestakeBtn = parseFloat(amount) > 0 && valueSelect.length > 0;

  const validRewards = useMemo(() => {
    if (
      balance &&
      balance.delegation &&
      balance.delegation !== 0 &&
      balance.rewards &&
      balance.rewards !== 0
    ) {
      const delegation = new BigNumber(balance.delegation);
      const rewards = new BigNumber(balance.rewards);
      const procentRewards = rewards
        .div(delegation)
        .multipliedBy(100)
        .toNumber();

      if (procentRewards > 0.01) {
        return true;
      }
      return false;
    }
    return false;
  }, [balance]);

  const handleHistory = (to) => {
    navigate(to);
  };

  if (passport === null && CYBER.CHAIN_ID === 'bostrom') {
    return (
      <ActionBarCenter
        btnText="get citizenship"
        onClickFnc={() => handleHistory('/portal')}
      />
    );
  }

  // addressPocket empty
  if (
    Object.keys(validators).length === 0 &&
    stage === STAGE_INIT &&
    addressPocket === null
  ) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Pane fontSize="18px">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            you don't have cyber address in your pocket
          </Pane>
        </ActionBarContentText>
      </ActionBar>
    );
  }

  // loadingBalanceInfo
  if (
    Object.keys(validators).length === 0 &&
    stage === STAGE_INIT &&
    loadingBalanceInfo
  ) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Pane fontSize="18px">
            <Dots />
          </Pane>
        </ActionBarContentText>
      </ActionBar>
    );
  }

  // stage balance.delegation === 0
  if (
    Object.keys(validators).length === 0 &&
    stage === STAGE_INIT &&
    balance.delegation &&
    balance.delegation === 0
  ) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Pane fontSize="18px">Choose hero to get H and earn rewards</Pane>
        </ActionBarContentText>
      </ActionBar>
    );
  }

  // stage balance.delegation === 0
  if (Object.keys(validators).length === 0 && stage === STAGE_INIT) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Pane fontSize="18px" display="flex" alignItems="center">
            {balanceToken[CYBER.DENOM_LIQUID_TOKEN] &&
              balanceToken[CYBER.DENOM_LIQUID_TOKEN].liquid !== 0 && (
                <Pane>
                  <button
                    type="button"
                    className="btn-disabled"
                    onClick={() => handleHistory('/hfr')}
                    style={{
                      height: 42,
                      maxWidth: '200px',
                      padding: '0 20px',
                      marginRight: '15px',
                    }}
                  >
                    Investmint
                  </button>
                  yor free H to get A and V
                </Pane>
              )}
            {balanceToken[CYBER.DENOM_LIQUID_TOKEN].liquid === 0 &&
              balance.available !== 0 &&
              'Choose hero to get H'}
            {validRewards && (
              <Pane marginLeft={15}>
                or
                <button
                  type="button"
                  className="btn-disabled"
                  onClick={() => claimRewards()}
                  style={{
                    height: 42,
                    maxWidth: '200px',
                    padding: '0 20px',
                    marginLeft: '15px',
                  }}
                >
                  Claim rewards
                </button>
              </Pane>
            )}
          </Pane>
        </ActionBarContentText>
      </ActionBar>
    );
  }

  if (
    Object.keys(validators).length !== 0 &&
    stage === STAGE_INIT &&
    addressPocket !== null &&
    addressPocket.keys === 'read-only'
  ) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Pane fontSize="18px">
            this {trimString(addressPocket.bech32, 8, 6)} address is read-only
          </Pane>
        </ActionBarContentText>
      </ActionBar>
    );
  }

  if (
    Object.keys(validators).length !== 0 &&
    stage === STAGE_INIT &&
    txType === null
  ) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Text fontSize="18px" color="#fff" fontWeight={600}>
            {validators.description.moniker}
          </Text>
        </ActionBarContentText>
        <Button onClick={() => funcSetTxType(TXTYPE_DELEGATE)}>Stake</Button>
        {unStake && (
          <div>
            <Button
              marginX={25}
              onClick={() => funcSetTxType(TXTYPE_UNDELEGATE)}
            >
              Unstake
            </Button>
            <Button onClick={() => funcSetTxType(TXTYPE_REDELEGATE)}>
              Restake
            </Button>
          </div>
        )}
      </ActionBar>
    );
  }

  if (
    stage === STAGE_READY &&
    (txType === TXTYPE_DELEGATE || txType === TXTYPE_UNDELEGATE)
  ) {
    return (
      <Delegate
        moniker={validators.description.moniker}
        onChangeInputAmount={(e) => setAmount(e.target.value)}
        toSend={amount}
        disabledBtn={amount.length === 0}
        generateTx={
          txType === TXTYPE_DELEGATE ? delegateTokens : undelegateTokens
        }
        delegate={txType === TXTYPE_DELEGATE}
      />
    );
  }

  if (stage === STAGE_READY && txType === TXTYPE_REDELEGATE) {
    return (
      <ReDelegate
        generateTx={() => redelegateTokens()}
        onChangeInputAmount={(e) => setAmount(e.target.value)}
        toSend={amount}
        disabledBtn={!validRestakeBtn}
        validatorsAll={validatorsAll}
        validators={validators}
        onChangeReDelegate={(e) => setValueSelect(e.target.value)}
        valueSelect={valueSelect}
      />
    );
  }

  if (stage !== STAGE_READY) {
    return (
      <StatusTx
        stage={stage}
        cleatState={clearFunc}
        errorMessage={errorMessage}
        txHash={txHash}
        txHeight={txHeight}
      />
    );
  }

  return null;
}

export default ActionBarContainer;
