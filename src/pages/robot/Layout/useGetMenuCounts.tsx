import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNewsToday } from 'src/containers/Wallet/card/tweet';
import { useGetHeroes } from 'src/containers/account/hooks';
import useGetGol from 'src/containers/gol/getGolHooks';
import { useGetIpfsInfo } from 'src/containers/ipfsSettings/ipfsComponents/infoIpfsNode';
import { useGetBalanceBostrom } from 'src/containers/sigma/hooks';
import { useQueryClient } from 'src/contexts/queryClient';
import { RootState } from 'src/redux/store';

import {
  getCyberlinks,
  getFollowers,
  getIpfsHash,
  getTweet,
} from 'src/utils/search/utils';
import { convertResources, reduceBalances } from 'src/utils/utils';
import { useRobotContext } from '../Robot';

function useGetMenuCounts(address: string) {
  const [tweetsCount, setTweetsCount] = useState();
  const [cyberlinksCount, setCyberlinksCount] = useState();
  const [energy, setEnergy] = useState<number>();
  const [followers, setFollowers] = useState<number>();

  const location = useLocation();
  const { addRefetch } = useRobotContext();

  async function getTweetCount() {
    try {
      const response = await getTweet(address);
      setTweetsCount(response.total_count);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!address) {
      return;
    }
    const type = location.pathname.split('/')[2];

    if (type === 'log') {
      addRefetch(getTweetCount);
    }
  }, [location.pathname, address]);

  const { accounts } = useSelector((state: RootState) => state.pocket);

  const queryClient = useQueryClient();

  const { staking } = useGetHeroes(address);
  const { totalAmountInLiquid } = useGetBalanceBostrom(address);
  const { repoSizeValue } = useGetIpfsInfo();
  const news = useNewsToday(address);

  const { resultGol } = useGetGol(address);
  const badges = Object.keys(resultGol).length
    ? Object.keys(resultGol).length - 1
    : 0;

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

  async function getFollow() {
    try {
      const addressHash = await getIpfsHash(address);
      const response = await getFollowers(addressHash);

      if (response.total_count) {
        setFollowers(response.total_count);
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
    getFollow();

    getTweetCount();
    getEnergy();
  }, [address]);

  return {
    log: tweetsCount,
    security: Object.keys(staking).length,
    badges,
    swarm: followers,
    energy,
    sigma: Number(totalAmountInLiquid.currentCap || 0),
    cyberlinks: cyberlinksCount,
    passport: accounts ? Object.keys(accounts).length : 0,
    drive: repoSizeValue,
    sense: news.count,
  };
}

export default useGetMenuCounts;
