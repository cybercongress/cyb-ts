/* eslint-disable import/no-unused-modules */
import { getFromLink, getToLink } from 'src/utils/search/utils';
import runeDeps from './runeDeps';
import { openAICompletion } from './services/llmRequests/openai';

// let runeDeps;

// export const initRuneDeps = (deps) => {
//   console.log('---initRuneDeps', deps);

//   runeDeps = deps;
// };
export async function jsCyberSearch(query) {
  return runeDeps.cybApi.graphSearch(query);
}

export async function jsCyberLink(fromCid, toCid) {
  return runeDeps.cybApi.cyberlink(fromCid, toCid);
}

export async function jsGetPassportByNickname(nickname) {
  return runeDeps.cybApi.getPassportByNickname(nickname);
}

export async function jsEvalScriptFromIpfs(cid, funcName, params = {}) {
  return runeDeps.cybApi.evalScriptFromIpfs(cid, funcName, params);
}

export async function jsGetIpfsTextContent(cid) {
  return runeDeps.getIpfsTextConent(cid);
}

export async function jsAddContenToIpfs(content) {
  return runeDeps.addContenToIpfs(content);
}

export async function jsOpenAICompletions(messages, apiKey, params, refId) {
  const result = await openAICompletion(messages, apiKey, params);
  return result;
}

export async function jsSearchByEmbedding(text, count) {
  return runeDeps.cybApi.searcByEmbedding(text, count);
}

export async function jsCyberLinksFrom(cid) {
  const result = await getFromLink(cid);
  return result;
}

export async function jsCyberLinksTo(cid) {
  const result = await getToLink(cid);
  return result;
}

export async function jsExecuteScriptCallback(refId, data) {
  console.log('exec deps callback', refId);
  return runeDeps.cybApi.executeScriptCallback(refId, data);
}
