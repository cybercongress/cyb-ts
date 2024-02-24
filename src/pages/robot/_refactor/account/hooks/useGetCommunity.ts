import { useEffect, useState } from 'react';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';

import {
  featchStoredSyncCommunity,
  fetchCommunity,
} from 'src/services/common/community';

import { useBackend } from 'src/contexts/backend/backend';
import { CommunityDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress } from 'src/types/base';

function useGetCommunity(
  address: string | null,
  { skip, main }: { skip?: boolean; main?: boolean }
) {
  const { fetchParticleAsync } = useQueueIpfsContent();
  const { dbApi, isDbInitialized } = useBackend();

  const [community, setCommunity] = useState({
    following: [] as NeuronAddress[],
    followers: [] as NeuronAddress[],
    friends: [] as NeuronAddress[],
  });
  // TODO: maybe refactor
  const [loading, setLoading] = useState({
    following: false,
    followers: false,
    friends: false,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCommunity({
      following: [],
      followers: [],
      friends: [],
    });
    setIsLoaded(false);
  }, [address]);

  useEffect(() => {
    const isInitialized = main ? isDbInitialized && dbApi : true;
    if (!address || skip || !isInitialized || !fetchParticleAsync || isLoaded) {
      return;
    }

    (async () => {
      const onResolve = (communityResolved: CommunityDto[]) => {
        const followers = communityResolved
          .filter((item) => item.follower && !item.following)
          .map((item) => item.neuron);
        const following = communityResolved
          .filter((item) => item.following && !item.follower)
          .map((item) => item.neuron);
        const friends = communityResolved
          .filter((item) => item.follower && item.following)
          .map((item) => item.neuron);

        setCommunity((community) => ({
          followers: [...new Set([...community.followers, ...followers])],
          following: [...new Set([...community.following, ...following])],
          friends: [...new Set([...community.friends, ...friends])],
        }));
      };

      if (main) {
        await featchStoredSyncCommunity(
          dbApi!,
          address,
          fetchParticleAsync,
          onResolve
        );
      } else {
        await fetchCommunity(address, fetchParticleAsync, onResolve);
      }

      setIsLoaded(true);

      // TODO: refactor, loading disabled
      // setLoading({ followers: true, following: true, friends: true });
    })();
  }, [
    dbApi,
    isDbInitialized,
    isLoaded,
    fetchParticleAsync,
    address,
    skip,
    main,
  ]);
  return {
    community,
    communityLoaded: isLoaded,
    loading,
  };
}

export default useGetCommunity;
