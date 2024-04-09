import { LCD_URL } from 'src/constants/config';
import { dataOrNull } from 'src/utils/axios';

import { Cosmos as CosmosLcdApi } from 'src/generated/Cosmos';

import { AxiosResponse } from 'axios';

const lcdCosmosApi = new CosmosLcdApi({ baseURL: LCD_URL });

// type ProposalType = ReturnType<typeof lcdCosmosApi.proposal> extends Promise<AxiosResponse<infer R>> ? R : never;

export const getTxs = async (txHash: string) => {
  const response = await lcdCosmosApi.getTx(txHash);
  return dataOrNull(response);
};
