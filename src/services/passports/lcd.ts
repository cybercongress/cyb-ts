import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';
import { toAscii, toBase64 } from '@cosmjs/encoding';
import { PassportContractQuery } from 'src/services/soft.js/api/passport';

import { LCD_URL } from 'src/constants/config';
import axios from 'axios';
import defaultNetworks from 'src/constants/defaultNetworks';

// need this request to query passports with any queryClient chain
export async function getPassport(query: PassportContractQuery) {
  const response = await axios.get(
    `${
      defaultNetworks.bostrom.LCD_URL
    }/cosmwasm/wasm/v1/contract/${CONTRACT_ADDRESS_PASSPORT}/smart/${toBase64(
      toAscii(JSON.stringify(query))
    )}`
  );
  return response.data.data;
}
