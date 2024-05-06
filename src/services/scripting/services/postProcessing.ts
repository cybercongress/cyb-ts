import { IPFSContent } from 'src/services/ipfs/types';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';

import { QueueItem } from 'src/services/QueueManager/types';
import { RuneEngine } from '../engine';
import { CybIpfsNode } from 'src/services/ipfs/types';
import { extractContentType } from 'src/services/ipfs/utils/content';

const contentToStringOrEmpty = (content: IPFSContent, contentType: string) =>
  contentType === 'text' && content.result instanceof Uint8Array
    ? uint8ArrayToAsciiString(content.result)
    : '';

/**
 * Execute 'particle' script to post process item: modify cid or content, or hide from view
 * @param item
 * @param content
 * @param ipfsNode
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export async function postProcessIpfContent(
  item: QueueItem,
  content: IPFSContent,
  rune: RuneEngine,
  ipfsNode: CybIpfsNode
): Promise<IPFSContent> {
  try {
    const { cid, controller, source } = item;
    const { meta, textPreview } = content;
    // TODO: refactor
    // textPreview only some beggining of content
    // refactor to use all the content
    // maybe move this outside
    const contentType = extractContentType(content);
    const mutation = await rune.personalProcessor({
      cid,
      contentType,
      content: contentToStringOrEmpty(content, contentType),
    });
    if (cid === 'QmakRbRoKh5Nss8vbg9qnNN2Bcsr7jUX1nbDeMT5xe8xa1') {
      console.log('----mutation', item.cid, content, mutation);
    }

    if (mutation.action === 'cid_result' && mutation.cid) {
      // refectch content from new cid
      const contentUpdated = await ipfsNode.fetchWithDetails(
        mutation.cid,
        undefined,
        controller
      );
      if (contentUpdated) {
        return { ...contentUpdated, mutation: 'modified' };
      }
    }

    if (mutation.action === 'content_result') {
      return { ...content, result: mutation.content, mutation: 'modified' };
    }

    if (mutation.action === 'hide') {
      return { ...content, mutation: 'hidden' };
    }

    if (mutation.action === 'error') {
      return { ...content, mutation: 'error' };
    }

    return content;
  } catch (e) {
    console.log('----exc', e);
  }
}
