import { useGetBalanceBostrom } from 'src/containers/sigma/hooks';
import ContainerLink from '../containerLink/ContainerLink';
import { routes } from 'src/routes';
import IconsNumber from '../IconsNumber/IconsNumber';

function HydrogenBalance({ address }) {
  const { totalAmountInLiquid } = useGetBalanceBostrom(address);

  return (
    <ContainerLink
      to={`${routes.neuron.getLink(address)}/sigma`}
      position="hydrogen"
    >
      <IconsNumber
        value={totalAmountInLiquid.currentCap}
        type="hydrogen"
        isVertical
      />
    </ContainerLink>
  );
}

export default HydrogenBalance;
