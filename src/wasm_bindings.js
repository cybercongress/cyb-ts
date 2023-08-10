/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unused-modules */
import { getPassportByNickname } from 'src/containers/portal/utils';
import { PATTERN_IPFS_HASH, DEFAULT_GAS_LIMITS } from 'src/utils/config';
import { promptToOpenAI } from 'src/services/scripting/openai';
import { getScriptFromParticle } from 'src/services/scripting/helpers';
import { getFromLink, getToLink, getIpfsHash } from 'src/utils/search/utils';
import { encodeSlash } from 'src/utils/utils';
import scriptEngine from './services/scripting/engine';
import { addContenToIpfs } from './utils/ipfs/utils-ipfs';
import { getIpfsTextContent } from './utils/ipfs/helpers';

// export function js_detectCybContentType(mime) {
//   return detectCybContentType(mime);
// }
// const { signer, signingClient } = useSigningClient();

export async function js_getPassportByNickname(nickname) {
  const client = scriptEngine.getSingleDep('queryClient');
  const result = await getPassportByNickname(client, nickname);
  return result;
}

export async function js_promptToOpenAI(prompt, apiKey) {
  const result = await promptToOpenAI(prompt, apiKey);
  return result;
}

export async function js_getIpfsTextContent(cid) {
  const ipfs = scriptEngine.getSingleDep('ipfs');
  const result = await getIpfsTextContent(ipfs, cid)?.content;
  return result;
}

export async function js_addContenToIpfs(content) {
  const ipfs = scriptEngine.getSingleDep('ipfs');
  const result = await addContenToIpfs(ipfs, content);
  return result;
}

export async function js_cyberLinksFrom(cid) {
  const result = await getFromLink(cid);
  return result;
}

export async function js_cyberLinksTo(cid) {
  const result = await getToLink(cid);
  return result;
}

export async function js_cyberSearch(query) {
  const client = scriptEngine.getSingleDep('queryClient');

  const cid = query.match(PATTERN_IPFS_HASH)
    ? query
    : await getIpfsHash(encodeSlash(query));

  const result = await client.search(cid, 0);
  return result;
}

export async function js_cyberLink(fromCid, toCid) {
  const { signer, signingClient } = scriptEngine.getDeps();

  if (!signer || !signingClient) {
    throw new Error('signer or signingClient not found');
  }

  const { address } = (await signer.getAccounts())[0];
  const fee = {
    amount: [],
    gas: DEFAULT_GAS_LIMITS.toString(),
  };
  const result = await signingClient.cyberlink(address, fromCid, toCid, fee);

  return result;
}

export async function js_evalScriptFromIpfs(cid, funcName, params = {}) {
  console.log('js_evalScriptFromIpfs', cid);
  try {
    const script = await getScriptFromParticle(cid);
    return scriptEngine.executeFunction(script, funcName, params);
  } catch (e) {
    return { action: 'error', message: e.toString() };
  }
  // .catch((e) => e);
}
