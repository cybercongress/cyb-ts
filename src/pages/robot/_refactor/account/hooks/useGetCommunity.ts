import { useEffect, useState } from 'react';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';

import { getAndSyncCommunity } from 'src/services/common/community';

import { useBackend } from 'src/contexts/backend/backend';
import { CommunityDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress } from 'src/types/base';

function useGetCommunity(address: string | null, skip?: boolean) {
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
  }, [address]);

  useEffect(() => {
    if (
      !address ||
      skip ||
      !isDbInitialized ||
      !dbApi ||
      !fetchParticleAsync ||
      isLoaded
    ) {
      return;
    }
    (async () => {
      await getAndSyncCommunity(
        dbApi,
        address,
        fetchParticleAsync,
        (community: CommunityDto[]) => {
          const followers = community
            .filter((item) => item.follower && !item.following)
            .map((item) => item.neuron);
          const following = community
            .filter((item) => item.following && !item.follower)
            .map((item) => item.neuron);

          const friends = community
            .filter((item) => item.follower && item.following)
            .map((item) => item.neuron);
          setCommunity((community) => ({
            followers: [...new Set([...community.followers, ...followers])],
            following: [...new Set([...community.following, ...following])],
            friends: [...new Set([...community.friends, ...friends])],
          }));
        }
      );
      setIsLoaded(true);
      setLoading({ followers: true, following: true, friends: true });
    })();
  }, [dbApi, isDbInitialized, isLoaded, fetchParticleAsync, address, skip]);

  return {
    community,
    communityLoaded: isLoaded,
    loading: {
      ...loading,
      friends: loading.friends || loading.followers || loading.following,
    },
  };
}

export default useGetCommunity;
