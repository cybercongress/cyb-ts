import axios from 'axios';
import { NeuronAddress } from 'src/types/base';
import { CID_TWEET } from 'src/utils/consts';

// https://lcd.bostrom.cybernode.ai/cosmos/tx/v1beta1/txs?pagination.offset=0&pagination.limit=20&orderBy=ORDER_BY_DESC&events=cyberlink.particleFrom%3D%27QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx%27&events=cyberlink.neuron%3D%27bostrom1uj85l9uar80s342nw5uqjrnvm3zlzsd0392dq3%27
const PAGINATION_LIMIT = 50;

export const getTweetsByNeuronAfterTimestamp = async (
  cyberLcdUrl: string,
  address: NeuronAddress,
  timestamp: number,
  offset: number = 0
) => {
  const response = await axios({
    method: 'get',
    url: `${cyberLcdUrl}/cosmos/tx/v1beta1/txs?pagination.offset=${offset}&pagination.limit=${PAGINATION_LIMIT}&orderBy=ORDER_BY_DESC&events=cyberlink.particleFrom%3D%27${CID_TWEET}%27&events=cyberlink.neuron%3D%27${address}%27`,
    //   url: `${cyberLcdUrl}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=${CID_TWEET}&limit=1000000000`,
  });
  return response.data;
};
