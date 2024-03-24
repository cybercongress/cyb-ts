import { CyberLinkSimple, CyberlinkTxHash, ParticleCid } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';
import { CID_TWEET } from 'src/constants/app';
import { LinkDto, TransactionDto } from 'src/services/CozoDb/types/dto';

import { fetchCyberlinksIterable } from '../../../indexer/cyberlinks';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { MAX_LINKS_RESOLVE_BATCH } from '../consts';
import {
  CYBER_LINK_TRANSACTION_TYPE,
  CyberLinkValue,
} from '../../../indexer/types';

const getUniqueParticlesFromLinks = (links: CyberLinkSimple[]) =>
  [
    ...new Set([
      ...links.map((link) => link.to),
      ...links.map((link) => link.from),
    ]),
  ] as ParticleCid[];

// eslint-disable-next-line import/no-unused-modules
export const fetchCyberlinksAndResolveParticles = async (
  cid: ParticleCid,
  timestampUpdate: number,
  particlesResolver: ParticlesResolverQueue,
  queuePriority: QueuePriority,
  abortSignal: AbortSignal
) => {
  const cyberlinksIterable = fetchCyberlinksIterable(
    cid,
    timestampUpdate,
    abortSignal
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
          particlesResolver!.enqueueBatch(cids, queuePriority),
        MAX_LINKS_RESOLVE_BATCH
      );
    }
  }

  return links;
};

export function extractCybelinksFromTransaction(batch: TransactionDto[]) {
  const cyberlinks = batch.filter(
    (l) => l.type === CYBER_LINK_TRANSACTION_TYPE
  );
  const particlesFound = new Set<string>();
  const links: LinkDto[] = [];
  // Get links: only from TWEETS
  const tweets: Record<ParticleCid, LinkDto> = cyberlinks.reduce<
    Record<ParticleCid, LinkDto>
  >((acc, { value, hash, timestamp }: TransactionDto) => {
    (value as CyberLinkValue).links.forEach((link) => {
      particlesFound.add(link.to);
      particlesFound.add(link.from);
      const txLink = {
        ...link,
        timestamp,
        neuron: (value as CyberLinkValue).neuron,
        transactionHash: hash,
      };
      links.push(txLink);

      if (link.from === CID_TWEET) {
        acc[txLink.to] = txLink;
      }
    });
    return acc;
  }, {});

  return {
    tweets,
    particlesFound: [...particlesFound],
    links,
  };
}
