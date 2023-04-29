import { useEffect, useState } from 'react';
import {
  ActionBar as ActionBarContainer,
  Pane,
  Button,
} from '@cybercongress/gravity';
import BigNumber from 'bignumber.js';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { useQueryClient } from 'src/contexts/queryClient';
import { useSigningClient } from 'src/contexts/signerClient';
import { Option } from 'src/types';
import { useSelector } from 'react-redux';
import { Coin } from '@cosmjs/launchpad';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import {
  ActionBarContentText,
  Account,
  LinkWindow,
  ActionBar as ActionBarCenter,
} from '../../components';
import { CYBER, DEFAULT_GAS_LIMITS, LEDGER } from '../../utils/config';
import {
  trimString,
  convertAmountReverce,
  selectNetworkImg,
} from '../../utils/utils';

import ActionBarStaps from '../teleport/actionBarSteps';
import { sortReserveCoinDenoms } from '../teleport/utils';
import { RootState } from 'src/redux/store';
import { TypeTab, TypeTabEnum } from './type';
import ImgDenom from 'src/components/valueImg/imgDenom';

const POOL_TYPE_INDEX = 1;

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const STAGE_CONFIRMED_IBC = 7.1;

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

const coinFunc = (amount: number, denom: string): Coin => {
  return { denom, amount: new BigNumber(amount).toString(10) };
};

// generated, recheck
interface Props {
  stateActionBar: {
    tokenAAmount: string;
    tokenBAmount: string;
    tokenA: string;
    tokenB: string;
    selectedPool: {
      id: string;
    };
    updateFunc?: () => void;
    isExceeded: boolean;
    tab: TypeTab;
    amountPoolCoin: string;
    myPools: Record<string, { id: string }>;
    selectMyPool: string;
  };
}

function ActionBar({ stateActionBar }: Props) {
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const queryClient = useQueryClient();
  const { signingClient, signer } = useSigningClient();
  const { traseDenom } = useIbcDenom();
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState<Option<string>>(undefined);
  const [txHashIbc, setTxHashIbc] = useState(null);
  const [linkIbcTxs, setLinkIbcTxs] = useState<Option<string>>(undefined);
  const [txHeight, setTxHeight] = useState<Option<number>>(undefined);
  const [errorMessage, setErrorMessage] =
    useState<Option<string | JSX.Element>>(undefined);

  const {
    tokenAAmount,
    tokenBAmount,
    tokenA,
    tokenB,
    selectedPool,
    updateFunc,
    isExceeded,
    tab,
    amountPoolCoin,
    myPools,
    selectMyPool,
  } = stateActionBar;

  useEffect(() => {
    const confirmTx = async () => {
      if (queryClient && txHash) {
        setStage(STAGE_CONFIRMING);
        const response = await queryClient.getTx(txHash);
        console.log('response :>> ', response);
        if (response !== null) {
          if (response.code === 0) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateFunc) {
              updateFunc();
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

  const createPool = async () => {
    if (signer && signingClient) {
      const [{ address }] = await signer.getAccounts();

      const [{ coinDecimals: coinDecimalsA }] = traseDenom(tokenA);
      const [{ coinDecimals: coinDecimalsB }] = traseDenom(tokenB);

      const reduceAmountA = convertAmountReverce(tokenAAmount, coinDecimalsA);
      const reduceAmountB = convertAmountReverce(tokenBAmount, coinDecimalsB);

      let depositCoins: Coin[] = [];

      if ([tokenA, tokenB].sort()[0] === tokenA) {
        depositCoins = [
          coinFunc(reduceAmountA, tokenA),
          coinFunc(reduceAmountB, tokenB),
        ];
      } else {
        depositCoins = [
          coinFunc(reduceAmountB, tokenB),
          coinFunc(reduceAmountA, tokenA),
        ];
      }

      const response = await signingClient.createPool(
        address,
        POOL_TYPE_INDEX,
        depositCoins,
        fee
      );

      if (response.code === 0) {
        setTxHash(response.transactionHash);
      } else {
        setTxHash(undefined);
        setErrorMessage(response.rawLog.toString());
        setStage(STAGE_ERROR);
      }
    }
  };

  const withdwawWithinBatch = async () => {
    if (signer && signingClient) {
      const [{ address }] = await signer.getAccounts();
      setStage(STAGE_SUBMITTED);

      let poolId = '';
      if (Object.prototype.hasOwnProperty.call(myPools, selectMyPool)) {
        poolId = myPools[selectMyPool].id;
      }
      const depositCoins = coinFunc(Number(amountPoolCoin), selectMyPool);

      if (addressActive !== null && addressActive.bech32 === address) {
        const response = await signingClient.withdwawWithinBatch(
          address,
          parseFloat(poolId),
          depositCoins,
          fee
        );

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
    }
  };

  const depositWithinBatch = async () => {
    if (signer && signingClient) {
      const [{ address }] = await signer.getAccounts();
      setStage(STAGE_SUBMITTED);
      const arrangedReserveCoinDenoms = sortReserveCoinDenoms(tokenA, tokenB);

      const amountX = Math.floor(Number(tokenAAmount));
      const amountY = Math.floor(Number(tokenBAmount));

      const deposit = {
        [tokenA]: amountX,
        [tokenB]: amountY,
      };

      const [{ coinDecimals: coinDecimalsA }] = traseDenom(
        arrangedReserveCoinDenoms[0]
      );
      const [{ coinDecimals: coinDecimalsB }] = traseDenom(
        arrangedReserveCoinDenoms[1]
      );

      deposit[arrangedReserveCoinDenoms[0]] = convertAmountReverce(
        deposit[arrangedReserveCoinDenoms[0]],
        coinDecimalsA
      );

      deposit[arrangedReserveCoinDenoms[1]] = convertAmountReverce(
        deposit[arrangedReserveCoinDenoms[1]],
        coinDecimalsB
      );

      const depositCoins = [
        coinFunc(
          deposit[arrangedReserveCoinDenoms[0]],
          arrangedReserveCoinDenoms[0]
        ),
        coinFunc(
          deposit[arrangedReserveCoinDenoms[1]],
          arrangedReserveCoinDenoms[1]
        ),
      ];

      if (addressActive !== null && addressActive.bech32 === address) {
        const response = await signingClient.depositWithinBatch(
          address,
          parseFloat(selectedPool.id),
          depositCoins,
          fee
        );

        if (response.code === 0) {
          setTxHash(response.transactionHash);
        } else {
          setTxHash(undefined);
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
    }
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(undefined);
    setTxHeight(undefined);
    setErrorMessage(undefined);
    setTxHashIbc(null);
    setLinkIbcTxs(undefined);
  };

  const actionBarConfig = {
    [TypeTabEnum.CREATE_POOL]: {
      button: {
        text: 'create pool',
        onClick: createPool,
        disabled: isExceeded,
      },
      text: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          price 1 000 000 000
          <img
            style={{ width: '20px', marginLeft: '5px' }}
            src={selectNetworkImg(CYBER.CHAIN_ID)}
            alt={CYBER.CHAIN_ID}
          />
        </div>
      ),
    },
    [TypeTabEnum.ADD_LIQUIDITY]: {
      button: {
        text: 'deposit',
        onClick: depositWithinBatch,
        disabled: isExceeded,
      },
    },
    [TypeTabEnum.SUB_LIQUIDITY]: {
      button: {
        text: 'withdrawal',
        onClick: withdwawWithinBatch,
        disabled: isExceeded,
      },
    },
  };

  if (stage !== STAGE_CONFIRMED_IBC) {
    return (
      <ActionBarCenter
        button={actionBarConfig[tab].button}
        text={errorMessage || actionBarConfig[tab].text}
      />
    );
  }

  if (stage === STAGE_CONFIRMED_IBC) {
    return (
      <ActionBarContainer>
        <ActionBarContentText display="inline">
          <Pane display="inline">Transaction Successful: </Pane>{' '}
          <LinkWindow to={linkIbcTxs}>{trimString(txHashIbc, 6, 6)}</LinkWindow>
        </ActionBarContentText>
        <Button marginX={10} onClick={cleatState}>
          Fuck Google
        </Button>
      </ActionBarContainer>
    );
  }

  const stageActionBarStaps = {
    stage,
    cleatState,
    txHash,
    txHeight,
    errorMessage,
  };

  return <ActionBarStaps stageActionBarStaps={stageActionBarStaps} />;
}

export default ActionBar;
