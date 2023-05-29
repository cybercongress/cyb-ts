import { useEffect, useState } from 'react';
import { useGetCommunity, useGetHeroes } from 'src/containers/account/hooks';
import useGetGol from 'src/containers/gol/getGolHooks';
import { useQueryClient } from 'src/contexts/queryClient';
import { getCyberlinks, getTweet } from 'src/utils/search/utils';
import { convertResources, reduceBalances } from 'src/utils/utils';

function useGetMenuCounts(address: string) {
  const [tweetsCount, setTweetsCount] = useState();
  const [cyberlinksCount, setCyberlinksCount] = useState();
  const [energy, setEnergy] = useState<number>();

  const queryClient = useQueryClient();

  const { staking } = useGetHeroes(address);
  const { resultGol } = useGetGol(address);
  const badges = Object.keys(resultGol).length
    ? Object.keys(resultGol).length - 1
    : 0;

  const {
    community: { followers },
  } = useGetCommunity(address);

  async function getTweetCount() {
    try {
      const response = await getTweet(address);
      setTweetsCount(response.total_count);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCyberlinksCount() {
    try {
      const response = await getCyberlinks(address);
      setCyberlinksCount(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function getEnergy() {
    try {
      const allBalances = await queryClient?.getAllBalances(address);
      const balances = reduceBalances(allBalances);

      if (balances.milliampere && balances.millivolt) {
        const { milliampere, millivolt } = balances;
        setEnergy(convertResources(milliampere) * convertResources(millivolt));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!address) {
      return;
    }

    getCyberlinksCount();

    getTweetCount();
    getEnergy();
  }, [address]);

  return {
    log: tweetsCount,
    security: Object.keys(staking).length,
    badges,
    swarm: followers.length,
    energy,
    cyberlinks: cyberlinksCount,
    passport: 1,
  };
}

export default useGetMenuCounts;
