import { routes } from 'src/routes';
import { Tooltip } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectUnreadCounts } from '../../redux/sense.redux';
import SideButtonLink from 'src/components/sideButtonLink/SideButtonLink';

function SenseButton() {
  const { particles, neurons } = useAppSelector(selectUnreadCounts);
  const total = particles + neurons;

  const totalString = total ? total.toString() : '';
  const firstThreedigits = totalString.slice(0, 3) || '0';
  const hiddenPartCount = totalString.length > 3 ? totalString.length - 3 : 1;

  return (
    <SideButtonLink to={routes.robot.routes.sense.path} buttonType="sense">
      <Tooltip tooltip="sense notifications">
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div>
            {Array.from({ length: hiddenPartCount }).map((_, index) => (
              <span key={index}>🧬</span>
            ))}
          </div>
          {firstThreedigits}
        </span>
      </Tooltip>
    </SideButtonLink>
  );
}

export default SenseButton;
