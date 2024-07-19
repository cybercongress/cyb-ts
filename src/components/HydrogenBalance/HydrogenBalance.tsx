import { useGetBalanceBostrom } from 'src/containers/sigma/hooks';
import SideButtonLink from '../sideButtonLink/SideButtonLink';
import { routes } from 'src/routes';
import IconsNumber from '../IconsNumber/IconsNumber';

function HydrogenBalance({ address, isVertical }) {
  const { totalAmountInLiquid } = useGetBalanceBostrom(address);

  return (
    <SideButtonLink
      to={`${routes.neuron.getLink(address)}/sigma`}
      buttonType="hydrogen"
    >
      <IconsNumber
        value={totalAmountInLiquid.currentCap}
        type="hydrogen"
        isVertical={isVertical}
      />
    </SideButtonLink>
  );
}

export default HydrogenBalance;
