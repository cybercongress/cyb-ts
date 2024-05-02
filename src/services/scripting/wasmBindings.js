/* eslint-disable import/no-unused-modules */
import runeDeps from './runeDeps';

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
  return runeDeps.evalScriptFromIpfs(cid, funcName, params);
}

export async function jsGetIpfsTextContent(cid) {
  return runeDeps.getIpfsTextConent(cid);
}

export async function jsAddContenToIpfs(content) {
  return runeDeps.addContenToIpfs(content);
}
