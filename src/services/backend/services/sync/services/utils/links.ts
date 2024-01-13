import {
  CyberLinkSimple,
  CyberLinkTimestamp,
  ParticleCid,
} from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';
import { CID_TWEET } from 'src/utils/consts';
import { dateToNumber } from 'src/utils/date';

import { fetchCyberlinksIterable } from '../../../dataSource/blockchain/requests';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { MAX_PARRALEL_LINKS } from '../consts';
import {
  CYBER_LINK_TRANSACTION_TYPE,
  CyberLinkTransaction,
  Transaction,
} from '../../../dataSource/blockchain/types';
import { ParticleResult } from '../../types';

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
export function extractCybelinksFromTransaction(batch: Transaction[]) {
  const cyberlinks = batch.filter(
    (l) => l.type === CYBER_LINK_TRANSACTION_TYPE
  ) as CyberLinkTransaction[];
  const particlesFound = new Set<string>();
  const links: CyberLinkTimestamp[] = [];
  // Get links: only from TWEETS
  const tweets: Record<ParticleCid, ParticleResult> = cyberlinks.reduce<
    Record<ParticleCid, ParticleResult>
  >(
    (
      acc,
      {
        value,
        transaction: {
          block: { timestamp },
        },
      }: CyberLinkTransaction
    ) => {
      value.links.forEach((link) => {
        particlesFound.add(link.to);
        particlesFound.add(link.from);

        links.push({ ...link, timestamp: dateToNumber(timestamp) });
        if (link.from === CID_TWEET) {
          acc[link.to] = {
            timestamp: dateToNumber(timestamp),
            direction: 'from',
            from: CID_TWEET,
            to: link.to,
          };
        }
      });
      return acc;
    },
    {}
  );

  return {
    tweets,
    particlesFound: [...particlesFound],
    links,
  };
}
