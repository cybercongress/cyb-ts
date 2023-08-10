import { queueManager } from '../QueueManager/QueueManager';
import { isCID } from 'src/utils/ipfs/helpers';
import { Nullable } from 'src/types';
import { getTextFromIpfsContent } from 'src/utils/ipfs/helpers';

export async function getScriptFromParticle(cid?: Nullable<string>) {
  if (!cid || !isCID(cid)) {
    // throw new Error('cid is not valid');
    return undefined;
  }

  const queueResult = await queueManager.enqueueAndWait(cid, {
    postProcessing: false,
  });
  const result = queueResult?.result;
  if (!result?.result || result?.contentType !== 'text') {
    // throw new Error('content is not valid');
    return undefined;
  }

  return getTextFromIpfsContent(result.result);
}

export function extractRuneContent(markdown: string) {
  // Regular expression to match the content between ```rune``` tags
  const runeRegex = /```rune\s*([\s\S]*?)```/g;

  let match;
  let runeScript = '';
  let modifiedMarkdown = markdown;

  // Iterate through all matches of the regular expression
  while ((match = runeRegex.exec(markdown)) !== null) {
    // Append the matched content between ```rune``` tags to runeContent variable
    runeScript += match[1] + '\n';

    // Replace the entire matched block, including the tags, with an empty string
    modifiedMarkdown = modifiedMarkdown.replace(match[0], '');
  }

  // Returning both the extracted content and the modified markdown without the tags
  return {
    script: runeScript.trim(),
    markdown: modifiedMarkdown,
  };
}
