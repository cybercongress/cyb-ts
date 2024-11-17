import { useEffect, useMemo, useState } from 'react';
import { useAdviser } from 'src/features/adviser/context';

import { DenomArr, MainContainer } from 'src/components';
import { BASE_DENOM, DENOM_LIQUID } from 'src/constants/config';

import { useCyberClient } from 'src/contexts/queryCyberClient';
import BigNumber from 'bignumber.js';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import Loader2 from 'src/components/ui/Loader2';
import ActionBarContainer from './ActionBarContainer';
import { InfoBalance } from './components';
import useGetHeroes from './hooks/getHeroesHook';
import { useGetBalance } from '../../pages/robot/_refactor/account/hooks';
import styles from './Validators.module.scss';
import ValidatorTable from './components/Table/Table';
import reduceValidatorData from './utils/reduceValidatorData';
import useValidatorStakingProvisions from './hooks/useValidatorStakingProvisions';
import { ValidatorTableData } from './types/tableData';
import useDelegatorDelegations from './hooks/useDelegatorDelegations';

function Validators() {
  const addressActive = useAppSelector(selectCurrentAddress);
  // const { status = 'active' } = useParams();
  const { hooks } = useCyberClient();

  const { data: stakingPool } = hooks.cosmos.staking.v1beta1.usePool({
    request: {},
  });
  const bondedTokens = stakingPool
    ? parseFloat(stakingPool.pool.bondedTokens)
    : 0;

  const { delegationsData, refetchDelegations } =
    useDelegatorDelegations(addressActive);

  const { data: stakingParamsData } = hooks.cosmos.staking.v1beta1.useParams({
    request: {},
  });

  const unbondingDays =
    stakingParamsData &&
    new BigNumber(
      BigInt(stakingParamsData.params.unbondingTime.seconds).toString()
    )
      .dividedBy(60)
      .dividedBy(60)
      .dividedBy(24)
      .toNumber();

  const { stakingProvisions, isFetching: isFetchingStakingProvisions } =
    useValidatorStakingProvisions();

  const [updatePage, setUpdatePage] = useState(0);

  const { balance, loadingBalanceInfo } = useGetBalance(
    addressActive,
    updatePage
  );

  const { validators, loadingValidators, refetchAll } = useGetHeroes();

  const [validatorSelect, setValidatorSelect] = useState<
    ValidatorTableData | undefined
  >(undefined);

  const { setAdviser } = useAdviser();

  const estimatedApr = useMemo(() => {
    if (!stakingProvisions || !bondedTokens) {
      return undefined;
    }
    return new BigNumber(stakingProvisions)
      .dividedBy(bondedTokens)
      .multipliedBy(100)
      .dp(2, BigNumber.ROUND_FLOOR)
      .toString();
  }, [stakingProvisions, bondedTokens]);

  useEffect(() => {
    setAdviser(
      <div className={styles.info}>
        {unbondingDays && (
          <>
            the current undelegation period is{' '}
            <strong>{unbondingDays} days</strong>
            <br />
          </>
        )}
        you need to burn 1 <DenomArr denomValue={DENOM_LIQUID} onlyImg /> to
        unstake 1 <DenomArr denomValue={BASE_DENOM} onlyImg />
      </div>
    );
  }, [setAdviser, unbondingDays]);

  const updateFnc = () => {
    setUpdatePage((item) => item + 1);
    setValidatorSelect(undefined);
    refetchAll();
    refetchDelegations();
  };

  if (loadingValidators || isFetchingStakingProvisions) {
    return <Loader2 />;
  }

  return (
    <>
      <MainContainer>
        <InfoBalance
          balance={balance}
          apr={estimatedApr}
          loadingBalanceInfo={loadingBalanceInfo}
        />
        <ValidatorTable
          data={reduceValidatorData(validators, {
            bondedTokens,
            delegationsData,
            stakingProvisions,
          })}
          onSelect={setValidatorSelect}
        />
      </MainContainer>
      <ActionBarContainer
        updateFnc={updateFnc}
        validators={validatorSelect}
        unStake={!!(validatorSelect && validatorSelect.delegation)}
        balance={balance}
        loadingBalanceInfo={loadingBalanceInfo}
      />
    </>
  );
}

export default Validators;
