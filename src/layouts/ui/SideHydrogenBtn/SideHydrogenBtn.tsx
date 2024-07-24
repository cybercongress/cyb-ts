import HydrogenBalance from 'src/components/HydrogenBalance/HydrogenBalance';
import SideButtonLink from 'src/components/sideButtonLink/SideButtonLink';
import { routes } from 'src/routes';

function SideHydrogenBtn({ address }: { address?: string }) {
  return (
    <SideButtonLink
      to={`${routes.neuron.getLink(address || '')}/sigma`}
      buttonType="hydrogen"
    >
      <HydrogenBalance address={address} />
    </SideButtonLink>
  );
}

export default SideHydrogenBtn;
