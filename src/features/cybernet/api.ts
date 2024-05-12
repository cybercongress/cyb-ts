import { CyberClient } from '@cybercongress/cyber-js';
import { CYBERNET_CONTRACT_ADDRESS } from './constants';

// use this for type somehow https://github.com/cybercongress/cybernet/tree/main/schema/raw
export type CybernetContractQuery = object;

export function queryCybernetContract(
  query: CybernetContractQuery,
  queryClient: CyberClient
) {
  return queryClient.queryContractSmart(CYBERNET_CONTRACT_ADDRESS, query);
}