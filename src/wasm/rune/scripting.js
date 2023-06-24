/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unused-modules */
// import { detectCybContentType } from 'src/utils/ipfs/content-utils';
import { getPassportByNickname } from 'src/containers/portal/utils';
// import { getCyberClient } from 'src/services/scripting/engine';
import { appContextManager } from 'src/services/scripting/bus';
import { promptToOpenAI } from 'src/services/scripting/openai';
import { getIpfsTextContent } from 'src/services/scripting/api';
// export function js_detectCybContentType(mime) {
//   return detectCybContentType(mime);
// }

export async function js_getPassportByNickname(nickname) {
  const client = appContextManager.deps.cyberClient;
  const result = await getPassportByNickname(client, nickname);
  return result;
}

export async function js_promptToOpenAI(prompt) {
  const result = await promptToOpenAI(prompt);
  return result;
}

export async function js_getIpfsTextContent(cid) {
  const ipfs = appContextManager.deps.ipfs;
  const result = await getIpfsTextContent(ipfs, cid);
  return result;
}
