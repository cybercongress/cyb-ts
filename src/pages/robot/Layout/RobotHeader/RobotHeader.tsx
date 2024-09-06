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
  const { avatar, nickname } = passport?.extension || {};

  return (
    <header className={styles.wrapper}>
      <Display noPadding color="blue">
        <div className={styles.content}>
          <div className={styles.level}>
            {nickname && <h3 className={styles.name}>{nickname}</h3>}
            <Level value={menuCounts} />
          </div>
          <AvataImgIpfs addressCyber={address} cidAvatar={avatar} />
          <div className={styles.addressName}>
            <MusicalAddress address={address} />
            <FirstTx address={address} />
          </div>
        </div>
        {!isOwner && <TabsNotOwner menuCounts={menuCounts} />}
      </Display>
    </header>
  );
}

export default RobotHeader;
