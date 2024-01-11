/* eslint-disable jsx-a11y/control-has-associated-label */
import { useMemo, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSigningClient } from 'src/contexts/signerClient';
import { Nullable } from 'src/types';
import { AccountValue } from 'src/types/defaultAccount';
import { CONTRACT_ADDRESS_GIFT, GIFT_ICON } from '../utils';
import { Dots, BtnGrd, ActionBar, Account } from '../../../components';
import { PATTERN_CYBER, CYBER } from '../../../utils/config';
import { trimString } from '../../../utils/utils';
import { TxHash } from '../hook/usePingTxs';
import { CurrentRelease } from './type';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import mssgsClaim from '../utilsMsgs';
import { useQueryClient } from 'src/contexts/queryClient';

const releaseMsg = (giftAddress: string) => {
  return {
    release: {
      gift_address: giftAddress,
    },
  };
};

const STEP_INIT = 0;
const STEP_CHECK_ACC = 1;
const STATE_CHANGE_ACCOUNT = 1.1;
const STEP_RELEASE = 2;

type Props = {
  txHash: Nullable<TxHash>;
  updateTxHash: (data: TxHash) => void;
  selectedAddress: Nullable<string>;
  isRelease: boolean;
  loadingRelease: boolean;
  addressActive: Nullable<AccountValue>;
  currentRelease: Nullable<CurrentRelease[]>;
  redirectFunc: (steps: 'claim' | 'prove') => void;
  callback?: (error: string) => void;
  useReleasedStage: {
    alreadyClaimed: number;
    availableRelease: number;
    gift: number;
    leftRelease: number;
    released: number;
  };
};

function ActionBarRelease({
  txHash,
  updateTxHash,
  selectedAddress,
  isRelease,
  currentRelease,
  totalGift,
  totalRelease,
  loadingRelease,
  callback,
  useReleasedStage,
  addressActive,
  redirectFunc,
}: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP_INIT);
  const { signer, signingClient } = useSigningClient();
  const queryClient = useQueryClient();

  const [currentTx, setCurrentTx] = useState<{
    hash: string;
    onSuccess: () => void;
  }>();

  useWaitForTransaction({
    hash: currentTx?.hash,
    onSuccess: currentTx?.onSuccess,
  });

  const getRelease = useCallback(async () => {
    try {
      if (signer && signingClient && currentRelease) {
        const { isNanoLedger, bech32Address: addressKeplr } =
          await signer.keplr.getKey(CYBER.CHAIN_ID);

        const msgs = [];

        if (currentRelease.length > 0) {
          currentRelease
            .slice(0, isNanoLedger ? 1 : currentRelease.length)
            .forEach((item) => {
              const { address } = item;
              const msgObject = releaseMsg(address);
              msgs.push(msgObject);
            });
        }

        if (msgs.length === 0) {
          return;
        }

        const MsgsBroadcast = await mssgsClaim(
          {
            sender: addressKeplr,
            isNanoLedger,
          },
          msgs,
          useReleasedStage.availableRelease,
          queryClient
        );

        console.log('MsgsBroadcast', MsgsBroadcast);

        if (!MsgsBroadcast.length) {
          return;
        }

        const gasLimit = 400000 * MsgsBroadcast.length;

        const fee = {
          amount: [],
          gas: gasLimit.toString(),
        };
        const executeResponseResult = await signingClient.signAndBroadcast(
          addressKeplr,
          [...MsgsBroadcast],
          fee,
          'cyber'
        );
        // const executeResponseResult = await signingClient.executeArray(
        //   addressKeplr,
        //   CONTRACT_ADDRESS_GIFT,
        //   msgs,
        //   'auto',
        //   CYBER.MEMO_KEPLR
        // );

        console.log('executeResponseResult', executeResponseResult);
        if (executeResponseResult.code === 0) {
          updateTxHash({
            status: 'pending',
            txHash: executeResponseResult.transactionHash,
          });
        }

        if (executeResponseResult.code) {
          updateTxHash({
            txHash: executeResponseResult?.transactionHash,
            status: 'error',
            rawLog: executeResponseResult?.rawLog.toString(),
          });
        }

        setStep(STEP_INIT);
      }
    } catch (error) {
      console.error(error);
      // FIXME: not clear how to handle error codes
      callback?.('contract call error');
      setStep(STEP_INIT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, signingClient, currentRelease, queryClient]);

  useEffect(() => {
    const checkAddress = async () => {
      if (step === STEP_CHECK_ACC || step === STATE_CHANGE_ACCOUNT) {
        if (signer && addressActive) {
          const [{ address }] = await signer.getAccounts();
          const { bech32 } = addressActive;
          if (address === bech32) {
            setStep(STEP_RELEASE);
            getRelease();
          } else {
            setStep(STATE_CHANGE_ACCOUNT);
          }
        }
      }
    };
    checkAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, signer, addressActive]);

  const useAddressOwner = useMemo(() => {
    if (addressActive) {
      const { name, bech32 } = addressActive;
      if (name !== undefined && name !== null) {
        return (
          <>
            account
            <span style={{ color: '#36d6ae', padding: '0 5px' }}>{name}</span>
          </>
        );
      }
      return (
        <>
          address
          <span style={{ color: '#36d6ae', padding: '0 5px' }}>
            {trimString(bech32, 10, 4)}
          </span>
        </>
      );
    }
    return '';
  }, [addressActive]);

  const useValidOwner = useMemo(() => {
    if (
      selectedAddress &&
      !selectedAddress.match(PATTERN_CYBER) &&
      currentRelease &&
      addressActive &&
      currentRelease.length > 0 &&
      currentRelease[0].addressOwner !== addressActive.bech32
    ) {
      return true;
    }

    return false;
  }, [addressActive, currentRelease, selectedAddress]);

  const isValidClaime = useMemo(() => {
    if (
      selectedAddress &&
      selectedAddress.match(PATTERN_CYBER) &&
      totalGift !== null &&
      totalRelease === null
    ) {
      return true;
    }

    const validFields =
      selectedAddress &&
      totalGift !== null &&
      totalRelease !== null &&
      !selectedAddress.match(PATTERN_CYBER);

    if (
      validFields &&
      Object.prototype.hasOwnProperty.call(totalGift, selectedAddress) &&
      !Object.prototype.hasOwnProperty.call(totalRelease, selectedAddress)
    ) {
      return true;
    }

    return false;
  }, [selectedAddress, totalGift, totalRelease]);

  const isValidProve = useMemo(() => {
    if (
      selectedAddress &&
      selectedAddress.match(PATTERN_CYBER) &&
      totalGift === null
    ) {
      return true;
    }

    if (
      selectedAddress &&
      totalGift !== null &&
      !selectedAddress.match(PATTERN_CYBER) &&
      !Object.prototype.hasOwnProperty.call(totalGift, selectedAddress)
    ) {
      return true;
    }

    return false;
  }, [selectedAddress, totalGift]);

  const useSelectCyber = useMemo(() => {
    return selectedAddress && selectedAddress.match(PATTERN_CYBER);
  }, [selectedAddress]);

  const redirectToGift = useCallback(
    (key: 'claim' | 'prove') => {
      if (redirectFunc) {
        redirectFunc(key);
      }

      navigate('/gift');
    },
    [navigate, redirectFunc]
  );

  if (currentRelease && useValidOwner) {
    return (
      <ActionBar>
        <div
          style={{
            display: 'flex',
          }}
        >
          already claimed by
          <Account
            styleUser={{ marginLeft: '5px' }}
            address={currentRelease[0].addressOwner}
          />
          . switch account to release
        </div>
      </ActionBar>
    );
  }

  if (step === STATE_CHANGE_ACCOUNT) {
    return (
      <ActionBar onClickBack={() => setStep(STEP_INIT)}>
        choose {useAddressOwner} in keplr
      </ActionBar>
    );
  }

  if (loadingRelease) {
    return (
      <ActionBar>
        <BtnGrd disabled text={<Dots />} />
      </ActionBar>
    );
  }

  if (isValidProve) {
    return (
      <ActionBar>
        <BtnGrd
          onClick={() => redirectToGift('prove')}
          text="go to prove address"
        />
      </ActionBar>
    );
  }

  if (isValidClaime) {
    return (
      <ActionBar>
        <BtnGrd onClick={() => redirectToGift('claim')} text="go to claim" />
      </ActionBar>
    );
  }

  if (totalRelease !== null) {
    return (
      <ActionBar>
        <BtnGrd
          disabled={isRelease === false || isRelease === null}
          onClick={() => setStep(STEP_CHECK_ACC)}
          text={
            useSelectCyber ? `release all ${GIFT_ICON}` : `release ${GIFT_ICON}`
          }
          pending={
            step === STEP_RELEASE ||
            step === STEP_CHECK_ACC ||
            txHash?.status === 'pending'
          }
        />
      </ActionBar>
    );
  }

  return null;
}

export default ActionBarRelease;
