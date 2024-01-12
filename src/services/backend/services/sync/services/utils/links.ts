import { CyberLinkSimple, ParticleCid } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';

import { fetchCyberlinksIterable } from '../../../dataSource/blockchain/requests';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { MAX_PARRALEL_LINKS } from '../consts';

export const getUniqueParticlesFromLinks = (links: CyberLinkSimple[]) =>
  [
    ...new Set([
      ...links.map((link) => link.to),
      ...links.map((link) => link.from),
    ]),
  ] as ParticleCid[];

// eslint-disable-next-line import/no-unused-modules
export const fetchCyberlinksAndResolveParticles = async (
  cyberIndexUrl: string,
  cid: ParticleCid,
  timestampUpdate: number,
  particlesResolver: ParticlesResolverQueue,
  queuePriority: QueuePriority
) => {
  const cyberlinksIterable = fetchCyberlinksIterable(
    cyberIndexUrl,
    cid,
    timestampUpdate
  );
  const links = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const batch of cyberlinksIterable) {
    links.push(...batch);
    const particles = getUniqueParticlesFromLinks(batch);
    if (particles.length > 0) {
      await asyncIterableBatchProcessor(
        particles,
        (cids: ParticleCid[]) =>
          particlesResolver!.enqueue(
            cids.map((cid) => ({
              id: cid,
              priority: queuePriority,
            }))
          ),
        MAX_PARRALEL_LINKS
      );
    }
  }

  return links;
};
