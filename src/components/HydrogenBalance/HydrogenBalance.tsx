import { useGetBalanceBostrom } from 'src/containers/sigma/hooks';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';
import IconsNumber from '../IconsNumber/IconsNumber';

function HydrogenBalance({ address, className }) {
  const { totalAmountInLiquid } = useGetBalanceBostrom(address);

  return (
    <Link to={`${routes.neuron.getLink(address)}/sigma`} className={className}>
      <IconsNumber
        value={totalAmountInLiquid.currentCap}
        type="hydrogen"
        isVertical
      />
    </Link>
  );
}

export default HydrogenBalance;
