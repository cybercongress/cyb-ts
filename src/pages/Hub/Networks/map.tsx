import { Cid } from 'src/components';
import ImgDenom from 'src/components/valueImg/imgDenom';
import { trimString } from 'src/utils/utils';

type RenderRow = {
  id: number;
  chainId: string;
  name: string;
  logo: string;
  genesisHash: string;
  prefix: string;
};

function renderRow({
  id,
  chainId,
  name,
  logo,
  prefix,
  genesisHash,
}: RenderRow) {
  return {
    id,
    chainId,
    name,
    logo: (
      <ImgDenom
        coinDenom=""
        tooltipStatus={false}
        infoDenom={{ coinImageCid: logo }}
      />
    ),
    genesisHash: <Cid cid={genesisHash}>{trimString(genesisHash, 6, 6)}</Cid>,
    prefix,
  };
}

export default renderRow;
