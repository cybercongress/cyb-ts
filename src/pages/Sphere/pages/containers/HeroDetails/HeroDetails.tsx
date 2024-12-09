import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useParams } from 'react-router-dom';

import { useSphereContext } from 'src/pages/Sphere/Sphere.context';
import { Tabs } from 'src/components';
import { useCallback } from 'react';
import Statistics from './components/Statistics/Statistics';
import Details from './components/Details/Details';
import reduceDetails from './utils/reduceDetails';
import useSelfDelegation from './hooks/useSelfDelegation';
import useDelegationRewards from './hooks/useDelegationRewards';
import useValidatorByContext from './hooks/useValidatorByContext';
import useValidatorDelegations from './hooks/useValidatorDelegations';
import ActionBarContainer from '../../components/ActionBarContainer/ActionBarContainer';
import Leadership from './components/Leadership/Leadership';
import Rumors from './components/Rumors/Rumors';
import SearchResultsTab from './components/SearchResultsTab/SearchResultsTab';

const mapTabs = [
  { key: 'main', to: '' },
  { key: 'rumors', to: 'rumors' },
  { key: 'leadership', to: 'leadership' },
  { key: 'search', to: 'search' },
];

function HeroDetails() {
  const addressActive = useAppSelector(selectCurrentAddress);
  const { address: operatorAddress, tab = 'main' } = useParams();
  const { delegationsData, bondedTokens, stakingProvisions, refetchFunc } =
    useSphereContext();

  const { validatorInfo } = useValidatorByContext(operatorAddress);

  const { reward, refetch: refetchReward } = useDelegationRewards(
    addressActive,
    operatorAddress
  );

  const { delegations } = useValidatorDelegations(operatorAddress);

  const { selfDelegationCoin } = useSelfDelegation(operatorAddress);

  const staked =
    operatorAddress && delegationsData[operatorAddress]
      ? delegationsData[operatorAddress]
      : undefined;

  const updateFnc = useCallback(() => {
    refetchFunc();
    refetchReward();
  }, [refetchFunc, refetchReward]);

  if (!validatorInfo) {
    return <div>...</div>;
  }

  return (
    <>
      <Statistics
        data={{
          staked,
          reward,
          info: {
            ...validatorInfo.description,
            status: validatorInfo.status,
          },
        }}
      />

      <Tabs
        selected={tab || 'main'}
        options={mapTabs.map((item) => ({
          key: item.key,
          to: `/sphere/hero/${validatorInfo.operatorAddress}/${item.to}`,
        }))}
      />

      {tab === 'main' && (
        <Details
          data={validatorInfo}
          options={{
            ...reduceDetails(
              validatorInfo,
              bondedTokens,
              selfDelegationCoin,
              stakingProvisions
            ),
            delegations,
          }}
        />
      )}
      {tab === 'rumors' && (
        <Rumors accountUser={validatorInfo.operatorAddress} />
      )}
      {tab === 'leadership' && (
        <Leadership accountUser={validatorInfo.operatorAddress} />
      )}

      {tab === 'search' && (
        <SearchResultsTab moniker={validatorInfo.description.moniker} />
      )}

      {tab !== 'search' && (
        <ActionBarContainer validators={validatorInfo} updateFnc={updateFnc} />
      )}
    </>
  );
}

export default HeroDetails;
