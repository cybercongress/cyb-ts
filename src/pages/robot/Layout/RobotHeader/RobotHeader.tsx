import { Display } from 'src/components';
import MusicalAddress from 'src/components/MusicalAddress/MusicalAddress';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import styles from './RobotHeader.module.scss';
import { useRobotContext } from '../../robot.context';

function RobotHeader() {
  const { address, passport } = useRobotContext();

  const avatar = passport?.extension?.avatar;
  const nickname = passport?.extension?.nickname;

  return (
    <header className={styles.wrapper}>
      <Display noPadding>
        <div className={styles.content}>
          <div className={styles.level}>
            <span className={styles.levelValue}>level 1</span>
            <span className={styles.levelTime}>1 year 145 day 06:46</span>
          </div>
          <AvataImgIpfs addressCyber={address} cidAvatar={avatar} />

          <div className={styles.addressName}>
            {nickname && <h3 className={styles.name}>{nickname}</h3>}
            <MusicalAddress address={address} />
          </div>
        </div>
      </Display>
    </header>
  );
}

export default RobotHeader;
