import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNewsToday } from 'src/pages/robot/Layout/tweet.temp';
import { useGetBalance } from 'src/pages/robot/_refactor/account/hooks';
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
import { useGetKarma } from 'src/containers/application/Karma/useGetKarma';
import { useRobotContext } from '../robot.context';

function useMenuCounts(address: string | null) {
  const [tweetsCount, setTweetsCount] = useState();
  const [cyberlinksCount, setCyberlinksCount] = useState();
  const [energy, setEnergy] = useState<number>();
  const [followers, setFollowers] = useState<number>();
  const [sequence, setSequence] = useState<number>();

  const location = useLocation();
  const { addRefetch, isOwner } = useRobotContext();

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

  // const { staking } = useGetHeroes(address);
  const { totalAmountInLiquid } = useGetBalanceBostrom(address);
  const { repoSizeValue } = useGetIpfsInfo();
  const news = useNewsToday(address);
  const { balance } = useGetBalance(address);

  const { data: karma } = useGetKarma(address);

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

  async function getSequence() {
    try {
      const response = await queryClient?.getSequence(address);
      setSequence(response?.sequence || 0);
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
    getSequence();
    getTweetCount();
    getEnergy();
  }, [address]);

  return {
    log: tweetsCount,
    // security: Object.keys(staking).length,
    badges,
    swarm: followers,
    energy: energy || 0,
    sigma: Number(totalAmountInLiquid.currentCap || 0),
    cyberlinks: cyberlinksCount,
    passport: accounts ? Object.keys(accounts).length : 0,
    drive: (isOwner && repoSizeValue) || '-',
    sense: news.count,
    karma: karma || 0,
    txs: sequence,
    rewards: balance.rewards,
  };
}

export default useMenuCounts;
