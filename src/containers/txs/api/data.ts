import { LCD_URL } from 'src/constants/config';
import { Cosmos as CosmosLcdApi } from 'src/generated/Cosmos';
import { dataOrNull } from 'src/utils/axios';

const lcdCosmosApi = new CosmosLcdApi({ baseURL: LCD_URL });

export const getTxs = async (txHash: string) => {
  const response = await lcdCosmosApi.getTx(txHash);
  return dataOrNull(response);
};
