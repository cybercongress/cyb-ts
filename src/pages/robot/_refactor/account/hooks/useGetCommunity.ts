import { useEffect, useRef, useState } from 'react';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';

import { fetchCommunity } from 'src/services/community/community';

import { CommunityDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress } from 'src/types/base';
import { makeCancellable } from 'src/utils/async/promise';

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

      // if (abortController.signal.aborted) {
      //   console.log('______ALREADY ABORTED');
      //   return;
      await makeCancellable(fetchCommunity, abortController.signal)(
        address,
        fetchParticleAsync,
        onResolve
      )
        .then(() => {
          setIsLoaded(true);
        })
        .catch((e) =>
          console.log(`>>>!!! sync community ${address} was cancelled`)
        );

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
