import { SyncQueueJobType } from 'src/services/CozoDb/types/entities';
import { QueuePriority } from 'src/services/QueueManager/types';
import { IPFSContent, IPFSContentMutated } from 'src/services/ipfs/types';
import { LinkDto } from 'src/services/CozoDb/types/dto';

import { getTextContentIfShouldEmbed } from '../../services/sync/services/ParticlesResolverQueue/ParticlesResolverQueue';
import { CYB_QUEUE_CHANNEL } from '../consts';
import { QueueChannelMessage } from './types';

export const createBackendQueueSender = () => {
  const channel = new BroadcastChannel(CYB_QUEUE_CHANNEL);

  return {
    enqueue: (msg: QueueChannelMessage) => {
      channel.postMessage(msg);
    },
  };
};

const busSender = createBackendQueueSender();

export const enqueueParticleEmbeddingMaybe = async (
  content: IPFSContentMutated
) => {
  const contentToEmbed = await getTextContentIfShouldEmbed(content);

  if (contentToEmbed) {
    busSender.enqueue({
      type: 'sync',
      data: {
        id: content.cid,
        data: contentToEmbed,
        jobType: SyncQueueJobType.embedding,
        priority: QueuePriority.MEDIUM,
      },
    });
  }

  return !!contentToEmbed;
};

export const enqueueParticleSave = (content: IPFSContentMutated) => {
  busSender.enqueue({
    type: 'particle',
    // TODO: add AsyncIterator serializer
    data: { ...content, result: undefined } as IPFSContent,
  });

  return true;
};

export const enqueueLinksSave = (links: LinkDto[]) => {
  busSender.enqueue({
    type: 'link',
    data: links,
  });
};
