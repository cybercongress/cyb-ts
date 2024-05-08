import {
  IPFSContent,
  IPFSContentMeta,
  IPFSContentMutated,
} from 'src/services/ipfs/types';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';

import { QueueItem, QueuePriority } from 'src/services/QueueManager/types';
import {
  createTextPreview,
  mimeToBaseContentType,
} from 'src/services/ipfs/utils/content';
import QueueManager from 'src/services/QueueManager/QueueManager';
import { RuneEngine } from '../engine';

const contentToStringOrEmpty = (content: IPFSContent, contentType: string) =>
  contentType === 'text' && content.result instanceof Uint8Array
    ? uint8ArrayToAsciiString(content.result)
    : '';

/**
 * Execute 'particle' script to post process item: modify cid or content, or hide from view
 * @param item
 * @param content
 * @param ipfsQueue
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export async function postProcessIpfContent(
  item: QueueItem,
  content: IPFSContent,
  rune: RuneEngine,
  ipfsQueue: QueueManager
): Promise<IPFSContentMutated> {
  try {
    const { cid, controller, source } = item;
    const { meta } = content;
    // TODO: refactor
    // textPreview only some beggining of content
    // refactor to use all the content
    // maybe move this outside
    const contentType = mimeToBaseContentType(meta?.mime);
    const mutation = await rune.personalProcessor({
      cid,
      contentType,
      content: contentToStringOrEmpty(content, contentType),
    });
    if (mutation.action === 'cid_result' && mutation.cid) {
      // refectch content from new cid
      const result = await ipfsQueue.enqueueAndWait(mutation.cid, {
        postProcessing: false,
        priority: QueuePriority.URGENT,
      });
      console.log('----cid_result', item.cid, content, mutation, result);

      if (result) {
        return {
          ...(result.result as IPFSContent),
          cidBefore: cid,
          mutation: 'modified',
        };
      }
    }

    if (mutation.action === 'content_result') {
      // update meta to reflect new content
      const meta = {
        type: 'file',
        size: mutation.content?.length,
        sizeLocal: mutation.content?.length,
        mime: 'text/plain',
      } as IPFSContentMeta;
      return {
        ...content,
        result: mutation.content,
        textPreview: createTextPreview(mutation.content),
        meta,
        mutation: 'modified',
      };
    }

    if (mutation.action === 'hide') {
      return { ...content, mutation: 'hidden' };
    }

    if (mutation.action === 'error') {
      return { ...content, mutation: 'error' };
    }

    return content as IPFSContentMutated;
  } catch (e) {
    console.log('----exc', e);
    return { ...content, mutation: 'error' };
  }
}
