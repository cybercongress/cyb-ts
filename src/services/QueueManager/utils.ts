import { IPFSContent, AppIPFS } from 'src/utils/ipfs/ipfs';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import { fetchIpfsContent } from 'src/utils/ipfs/utils-ipfs';

import scriptEngine from '../scripting/engine';
import { QueueItem } from './QueueManager.d';

const contentToStringOrEmpty = (content: IPFSContent) =>
  content.contentType === 'text' && content.result instanceof Uint8Array
    ? uint8ArrayToAsciiString(content.result)
    : '';

/**
 * Execute 'particle' script to post process item: modify cid or content, or hide from view
 * @param item
 * @param content
 * @param node
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export async function postProcessIpfContent<T extends IPFSContent>(
  item: QueueItem<T>,
  content: IPFSContent,
  node: AppIPFS
): Promise<IPFSContent> {
  const { cid, controller, source } = item;

  const mutation = await scriptEngine.personalProcessor({
    cid,
    contentType: content?.contentType || '',
    content: contentToStringOrEmpty(content),
  });

  if (mutation.action === 'cid_result' && mutation.cid) {
    // refectch content from new cid
    const contentUpdated = await fetchIpfsContent<IPFSContent>(
      mutation.cid,
      source,
      {
        controller,
        node,
      }
    );
    if (contentUpdated) {
      return { ...contentUpdated, mutation: 'modified' };
    }
  }

  if (mutation.action === 'content_result') {
    // console.log('content_result', mutation);
    return { ...content, result: mutation.content, mutation: 'modified' };
  }

  if (mutation.action === 'hide') {
    return { ...content, mutation: 'hidden' };
  }

  if (mutation.action === 'error') {
    return { ...content, mutation: 'error' };
  }

  return content;
}
