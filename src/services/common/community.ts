import { NeuronAddress, ParticleCid } from 'src/types/base';
import { getIpfsHash } from 'src/utils/search/utils';
import { PATTERN_CYBER } from 'src/utils/config';

import DbApiWrapper from '../backend/services/dataSource/indexedDb/dbApiWrapper';
import { getFollowsAsCid, getFollowers } from '../backend/services/lcd/lcd';
import { FetchParticleAsync } from '../QueueManager/types';
import { CommunityDto } from '../CozoDb/types/dto';

// eslint-disable-next-line import/prefer-default-export
export const getAndSyncCommunity = async (
  dbApi: DbApiWrapper,
  address: NeuronAddress,
  fetchParticleAsync?: FetchParticleAsync,
  onResolve?: (community: CommunityDto[]) => void
) => {
  const storedCommunity = await dbApi.getCommunity(address);

  const storedCommunityMapByCid = new Map(
    storedCommunity.map((c) => [c.particle, c])
  );

  const communityUpdatesMap = new Map<ParticleCid, CommunityDto>();

  onResolve && onResolve(storedCommunity);

  const getExistingOrDefault = (cid: ParticleCid): Partial<CommunityDto> =>
    storedCommunityMapByCid.get(cid) || {
      ownerId: address,
      name: '',
      following: false,
      follower: false,
    };

  const followsCids = await getFollowsAsCid(address);
  const followers = await getFollowers(address);

  const newFollowerCids = followsCids.filter(
    (cid) => !storedCommunity.some((i) => i.particle === cid && i.following)
  );

  const newFollowingNeurons = followers.filter(
    (addr) => !storedCommunity.some((i) => i.neuron === addr && i.follower)
  );

  console.log(
    `>>> sync community ${address}, stored ${storedCommunity.length} new followers: ${newFollowerCids.length} new following: ${newFollowingNeurons.length}`
  );

  await Promise.all(
    newFollowerCids.map(async (cid) => {
      const neuron = (await fetchParticleAsync!(cid))?.result?.textPreview;
      if (neuron && neuron.match(PATTERN_CYBER)) {
        const communityItem = {
          ...getExistingOrDefault(cid),
          neuron,
          particle: cid,
          following: true,
        } as CommunityDto;

        await dbApi.putCommunity(communityItem);
        communityUpdatesMap.set(cid, communityItem);
      }
    })
  );

  await Promise.all(
    newFollowingNeurons.map(async (neuron) => {
      const cid = await getIpfsHash(neuron);

      const existingUpdate = communityUpdatesMap.get(cid) || {};

      const communityItem = {
        ...getExistingOrDefault(cid),
        ...existingUpdate,
        particle: cid,
        neuron,
        follower: true,
      } as CommunityDto;

      await dbApi.putCommunity(communityItem);
      communityUpdatesMap.set(cid, communityItem);
    })
  );

  const communityUpdates = [...communityUpdatesMap.values()];

  if (communityUpdatesMap.size > 0 && onResolve) {
    onResolve(communityUpdates);
  }

  return [...storedCommunity, ...communityUpdates];
};
