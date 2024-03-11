import { useGetBalanceBostrom } from 'src/containers/sigma/hooks';
import IconsNumber from '../IconsNumber/IconsNumber';

function HydrogenBalance({ address }) {
  const { totalAmountInLiquid } = useGetBalanceBostrom(address);

  return (
    <div>
      <IconsNumber value={totalAmountInLiquid.currentCap} type="hydrogen" />
    </div>
  );
}

export default HydrogenBalance;
