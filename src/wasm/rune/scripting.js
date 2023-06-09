import { detectCybContentType } from 'src/utils/ipfs/content-utils';
import { getPassportByNickname } from 'src/containers/portal/utils';
import { getCyberClient } from 'src/services/scripting/engine';

export function js_detectCybContentType(mime) {
  return detectCybContentType(mime);
}
export function js_function(arg) {
  const result = 'Abrrrr js TS, ' + arg + '!';
  // console.log(result);
  return result;
}

export async function js_getPassportByNickname(nickname) {
  const client = getCyberClient();
  const result = await getPassportByNickname(client, nickname);
  console.log('- js_getPassportByNickname result', nickname, result);
  return result;
}
