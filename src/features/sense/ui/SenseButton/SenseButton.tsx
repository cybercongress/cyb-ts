import { routes } from 'src/routes';
import { Tooltip } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectUnreadCounts } from '../../redux/sense.redux';
import ContainerLink from 'src/components/containerLink/ContainerLink';

function SenseButton() {
  const { particles, neurons } = useAppSelector(selectUnreadCounts);
  const total = particles + neurons;

  return (
    <ContainerLink to={routes.robot.routes.sense.path} position="sense">
      <Tooltip tooltip="sense notifications">
        <span>{total || ''} 🧬</span>
      </Tooltip>
    </ContainerLink>
  );
}

export default SenseButton;
