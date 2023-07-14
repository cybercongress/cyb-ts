import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { coinDecimals } from '../../../../../utils/utils';

function useGetHeroes(address, updateAddress) {
  const queryClient = useQueryClient();
  const [staking, setStaking] = useState([]);
  const [totalRewards, setTotalRewards] = useState([]);
  const [loadingHeroesInfo, setLoadingHeroesInfo] = useState(true);

  const getStaking = async () => {
    setStaking([]);
    setTotalRewards([]);
    setLoadingHeroesInfo(true);
    if (queryClient) {
      let delegations = [];
      const delegatorDelegations = await queryClient.delegatorDelegations(
        address
      );
      const { delegationResponses } = delegatorDelegations;
      if (delegationResponses.length > 0) {
        delegations = delegationResponses.reduce(
          (obj, item) => ({
            ...obj,
            [item.delegation.validatorAddress]: {
              ...item,
            },
          }),
          {}
        );
      }

      const delegatorUnbondingDelegations =
        await queryClient.delegatorUnbondingDelegations(address);
      const { unbondingResponses } = delegatorUnbondingDelegations;
      if (unbondingResponses.length > 0) {
        unbondingResponses.forEach((itemUnb) => {
          if (
            Object.prototype.hasOwnProperty.call(
              delegations,
              itemUnb.validatorAddress
            )
          ) {
            delegations[itemUnb.validatorAddress].entries = itemUnb.entries;
          }
        });
      }

      const delegationTotalRewards = await queryClient.delegationTotalRewards(
        address
      );
      const { rewards } = delegationTotalRewards;
      if (rewards.length > 0) {
        setTotalRewards(rewards);
        rewards.forEach((item) => {
          const addressValidator = item.validatorAddress;
          if (Object.hasOwnProperty.call(delegations, addressValidator)) {
            let amountReward = 0;
            const { reward } = item;
            if (reward !== null && reward[0] && reward[0].amount) {
              amountReward = coinDecimals(parseFloat(reward[0].amount));
              delegations[addressValidator].reward = Math.floor(amountReward);
            } else {
              delegations[addressValidator].reward = amountReward;
            }
          }
        });
      }

      setStaking(delegations);
      setLoadingHeroesInfo(false);
    } else {
      setLoadingHeroesInfo(false);
    }
  };

  useEffect(() => {
    if (!address) return;

    getStaking();
  }, [address, updateAddress]);

  return { staking, totalRewards, loadingHeroesInfo, refetch: getStaking };
}

export default useGetHeroes;
