import { useEffect, useState } from 'react';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';

import { fetchCommunity } from 'src/services/community/community';

import { CommunityDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress } from 'src/types/base';
import { makeCancellable } from 'src/utils/async/promise';
import { removeDublicates } from 'src/utils/list';

function useGetCommunity(address: string | null, { skip }: { skip?: boolean }) {
  const { fetchParticleAsync } = useQueueIpfsContent();
  const [abortController, setAbortController] = useState(new AbortController());

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
    abortController.abort();

    setAbortController(abortController);

    setIsLoaded(false);

    // don't set abortController
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (!address || skip || !fetchParticleAsync || isLoaded) {
      return;
    }

    (async () => {
      const communityRaw: CommunityDto[] = [];

      const onResolve = (communityResolved: CommunityDto[]) => {
        communityRaw.push(...communityResolved);
        const followers = communityRaw
          .filter((item) => item.follower && !item.following)
          .map((item) => item.neuron);
        const following = communityRaw
          .filter((item) => item.following && !item.follower)
          .map((item) => item.neuron);
        const friends = communityRaw
          .filter((item) => item.follower && item.following)
          .map((item) => item.neuron);

        // TODO: exclude dublicates when followe and following from 2 sources
        // const allItems = [...state.community.raw, ...items];

        setCommunity((community) => ({
          followers: removeDublicates([...community.followers, ...followers]),
          following: removeDublicates([...community.following, ...following]),
          friends: removeDublicates([...community.friends, ...friends]),
        }));
      };

      await makeCancellable(fetchCommunity, abortController.signal)(
        address,
        fetchParticleAsync,
        onResolve
      )
        .catch(() =>
          console.log(`>>>!!! sync community ${address} was cancelled`)
        )
        .finally(() => {
          setIsLoaded(true);
        });

      // TODO: refactor, loading disabled
      // setLoading({ followers: true, following: true, friends: true });
    })();
  }, [isLoaded, fetchParticleAsync, address, skip, abortController]);

  return {
    community,
    communityLoaded: isLoaded,
    loading,
  };
}

export default useGetCommunity;
