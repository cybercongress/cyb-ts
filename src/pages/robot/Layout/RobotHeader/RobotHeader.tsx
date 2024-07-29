import { Display } from 'src/components';
import MusicalAddress from 'src/components/MusicalAddress/MusicalAddress';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import styles from './RobotHeader.module.scss';
import { useRobotContext } from '../../robot.context';
import FirstTx from './ui/FirstTx/FirstTx';
import Level from './ui/Level/Level';
import TabsNotOwner from './ui/TabsNotOwner/TabsNotOwner';

function RobotHeader({ menuCounts }) {
  const { address, passport, isOwner } = useRobotContext();

  const avatar = passport?.extension?.avatar;
  const nickname = passport?.extension?.nickname;

  return (
    <header className={styles.wrapper}>
      <Display noPadding color="blue">
        <div className={styles.content}>
          <div className={styles.level}>
            <Level value={menuCounts} />
            {address && <FirstTx address={address} />}
          </div>
          <AvataImgIpfs addressCyber={address} cidAvatar={avatar} />

          <div className={styles.addressName}>
            {nickname && <h3 className={styles.name}>{nickname}</h3>}
            <MusicalAddress address={address} />
          </div>
        </div>
        {!isOwner && <TabsNotOwner menuCounts={menuCounts} />}
      </Display>
    </header>
  );
}

export default RobotHeader;
