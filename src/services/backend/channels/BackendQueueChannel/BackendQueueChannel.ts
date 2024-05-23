import type DeferredDbSaver from '../../services/DeferredDbSaver/DeferredDbSaver';
import ParticlesResolverQueue from '../../services/sync/services/ParticlesResolverQueue/ParticlesResolverQueue';
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

export class BackendQueueChannelListener {
  private channel = new BroadcastChannel(CYB_QUEUE_CHANNEL);

  private particlesResolver: ParticlesResolverQueue;

  private defferedDbSaver: DeferredDbSaver;

  constructor(
    particlesResolver: ParticlesResolverQueue,
    defferedDbSaver: DeferredDbSaver
  ) {
    this.particlesResolver = particlesResolver;
    this.defferedDbSaver = defferedDbSaver;

    this.channel.onmessage = (event) => this.onMessage(event);

    this.channel.onmessageerror = (event) =>
      console.error(`${CYB_QUEUE_CHANNEL} error`, event);
  }

  private onMessage(msg: MessageEvent<QueueChannelMessage>) {
    const { type, data } = msg.data;
    if (type === 'link') {
      this.defferedDbSaver.enqueueLinks(data);
    } else if (type === 'particle') {
      this.defferedDbSaver.enqueueIpfsContent(data);
    } else if (type === 'sync') {
      this.particlesResolver.enqueue(
        Array.isArray(data)
          ? data.map((d) => ({ ...d, data: JSON.stringify(d.data) }))
          : [{ ...data, data: JSON.stringify(data.data) }]
      );
    }
  }
}
