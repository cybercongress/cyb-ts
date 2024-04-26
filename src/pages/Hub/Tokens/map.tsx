import ImgDenom from 'src/components/valueImg/imgDenom';
import { trimString } from 'src/utils/utils';

type RenderRow = {
  id: number;
  chainId: string;
  channelId: string;
  ticker: string;
  logo: string;
  contract: string;
  decimals: string;
};

function renderRow({
  id,
  contract,
  channelId,
  ticker,
  logo,
  decimals,
  chainId,
}: RenderRow) {
  return {
    id,
    contract: contract.includes('ibc') ? trimString(contract, 9, 6) : contract,
    channelId,
    ticker,
    logo: (
      <ImgDenom
        coinDenom=""
        tooltipStatus={false}
        infoDenom={{ coinImageCid: logo }}
      />
    ),
    decimals,
    chainId,
  };
}

export default renderRow;
