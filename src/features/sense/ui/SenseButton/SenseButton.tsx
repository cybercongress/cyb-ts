import { routes } from 'src/routes';
import { Tooltip } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectUnreadCounts } from '../../redux/sense.redux';
import SideButtonLink from 'src/components/sideButtonLink/SideButtonLink';

function SenseButton() {
  const { particles, neurons } = useAppSelector(selectUnreadCounts);
  const total = particles + neurons;

  return (
    <SideButtonLink to={routes.robot.routes.sense.path} buttonType="sense">
      <Tooltip tooltip="sense notifications">
        <span>{total || ''} 🧬</span>
      </Tooltip>
    </SideButtonLink>
  );
}

export default SenseButton;
