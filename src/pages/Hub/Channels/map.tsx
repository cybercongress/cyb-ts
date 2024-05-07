import { Dot } from 'src/components';

type RenderRow = {
  id: number;
  active: string;
  destinationChainId: string;
  destinationChannelId: string;
  sourceChainId: string;
  sourceChannelId: string;
};

function renderRow({
  id,
  active,
  destinationChainId,
  destinationChannelId,
  sourceChainId,
  sourceChannelId,
}: RenderRow) {
  return {
    id,
    active: <Dot color={active ? 'green' : 'red'} animation />,
    destinationChainId,
    destinationChannelId,
    sourceChainId,
    sourceChannelId,
  };
}

export default renderRow;
