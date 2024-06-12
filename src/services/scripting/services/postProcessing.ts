import {
  IPFSContentDetails,
  IPFSContentDetailsMutated,
} from 'src/services/ipfs/types';

import { QueuePriority } from 'src/services/QueueManager/types';
import { parseArrayLikeToDetails } from 'src/services/ipfs/utils/content';
import { ParticleCid } from 'src/types/base';
import { IpfsApi } from 'src/services/backend/workers/background/api/ipfsApi';
import { RuneEngine } from '../engine';

/**
 * Execute 'particle' script to post process item: modify cid or content, or hide from view
 * @param item
 * @param details
 * @param ipfsQueue
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export async function postProcessIpfContent(
  cid: ParticleCid,
  details: IPFSContentDetails,
  rune: RuneEngine,
  ipfsApi: IpfsApi
): Promise<IPFSContentDetailsMutated> {
  try {
    const { type: contentType, content } = details!;

    const mutation = await rune.personalProcessor({
      cid,
      contentType,
      content,
    });

    if (mutation.action === 'cid_result' && mutation.cid) {
      // refectch content from new cid
      const result = await ipfsApi.enqueueAndWait(mutation.cid, {
        priority: QueuePriority.URGENT,
      });
      const mutatedDetails = await parseArrayLikeToDetails(
        result.result,
        mutation.cid
      );
      // console.log('----cid_result', cid, details, mutation, result);

      if (result) {
        return {
          ...mutatedDetails,
          cidBefore: cid,
          mutation: 'modified',
        };
      }
    }

    if (mutation.action === 'content_result') {
      // update meta to reflect new content
      // const meta = {
      //   type: 'file',
      //   size: mutation.content?.length,
      //   sizeLocal: mutation.content?.length,
      //   mime: 'text/plain',
      //   contentType: 'text',
      // } as IPFSContentMeta;
      return {
        ...details,
        content: mutation.content,
        text: mutation.content,
        mutation: 'modified',
      };
    }

    if (mutation.action === 'hide') {
      return { ...details, mutation: 'hidden' };
    }

    if (mutation.action === 'error') {
      return { ...details, mutation: 'error' };
    }

    return details as IPFSContentDetailsMutated;
  } catch (e) {
    console.log('----exc', e);
    return { ...details, mutation: 'error' };
  }
}
