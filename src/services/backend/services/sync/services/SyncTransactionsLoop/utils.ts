import { CyberLinkTimestamp, ParticleCid } from 'src/types/base';
import { CID_TWEET } from 'src/utils/consts';
import { dateToNumber } from 'src/utils/date';

import {
  Transaction,
  CYBER_LINK_TRANSACTION_TYPE,
  CyberLinkTransaction,
} from '../../../dataSource/blockchain/types';
import { ParticleResult } from '../../types';

// eslint-disable-next-line import/prefer-default-export
export function extractParticlesResults(batch: Transaction[]) {
  const cyberlinks = batch.filter(
    (l) => l.type === CYBER_LINK_TRANSACTION_TYPE
  ) as CyberLinkTransaction[];
  const particlesFound = new Set<string>();
  const links: CyberLinkTimestamp[] = [];
  // Get links: only from TWEETS
  const particleTimestampRecord: Record<ParticleCid, ParticleResult> =
    cyberlinks.reduce<Record<ParticleCid, ParticleResult>>(
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
    tweets: particleTimestampRecord,
    particlesFound: [...particlesFound],
    links,
  };
}
