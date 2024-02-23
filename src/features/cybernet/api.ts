// TODO: add type

import { CyberClient } from '@cybercongress/cyber-js';
import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';

// https://github.com/cybercongress/cw-cybergift/tree/main/contracts/cw-cyber-passport/schema
export type PassportContractQuery = {
  active_passport:
    | {
        address: string;
      }
    | {
        passport_by_nickname: {
          nickname: string;
        };
      }
    | {
        nft_info: {
          token_id: string;
        };
      };
};

export function queryContract2(query: any, queryClient: CyberClient) {
  return queryClient.queryContractSmart(
    'pussy1ddwq8rxgdsm27pvpxqdy2ep9enuen6t2yhrqujvj9qwl4dtukx0s8hpka9',
    query
  );
}
