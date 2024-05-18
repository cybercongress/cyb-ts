import { SyncQueueJobType } from 'src/services/CozoDb/types/entities';
import { QueuePriority } from 'src/services/QueueManager/types';
import { IPFSContentMutated } from 'src/services/ipfs/types';

import { createBackendQueueSender } from './BackendQueueChannel';

import { getContentToEmbed } from '../../services/sync/services/ParticlesResolverQueue/ParticlesResolverQueue';

const busSender = createBackendQueueSender();

export const enqueueParticleEmbeddingMaybe = async (
  content: IPFSContentMutated
) => {
  const [contentType, data] = await getContentToEmbed(content);

  const shouldEmbed = contentType === 'text' && !!data;

  if (shouldEmbed) {
    busSender.enqueue({
      type: 'sync',
      data: {
        id: content.cid,
        data,
        jobType: SyncQueueJobType.embedding,
        priority: QueuePriority.MEDIUM,
      },
    });
  }

  return shouldEmbed;
};
