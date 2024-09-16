import { routes } from 'src/routes';
import { Tooltip } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectUnreadCounts } from '../../redux/sense.redux';
import SideButtonLink from 'src/components/sideButtonLink/SideButtonLink';
import styles from './SenseButton.module.scss';

function SenseButton() {
  const { particles, neurons } = useAppSelector(selectUnreadCounts);
  const notificationCount = particles + neurons;

  const notificationCountStr =
    typeof notificationCount === 'number' ? notificationCount.toString() : '';
  const firstThreedigits = notificationCountStr.slice(0, 3) || '0';
  const hiddenPartCount =
    notificationCountStr.length > 3 ? notificationCountStr.length - 3 : 1;

  return (
    <SideButtonLink to={routes.robot.routes.sense.path} buttonType="sense">
      <Tooltip tooltip="sense notifications">
        <span className={styles.wrapper}>
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
