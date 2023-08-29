import { ContainerGradientText } from 'src/components';
import styles from './RobotHeader.module.scss';
import { useRobotContext } from '../../robot.context';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import MusicalAddress from 'src/components/MusicalAddress/MusicalAddress';

function RobotHeader() {
  const { address, passport } = useRobotContext();

  const avatar = passport?.extension?.avatar;
  const nickname = passport?.extension?.nickname;

  return (
    <header className={styles.wrapper}>
      <ContainerGradientText>
        <div className={styles.inner}>
          <AvataImgIpfs addressCyber={address} cidAvatar={avatar} />

          <div>
            {nickname && <h3 className={styles.name}>{nickname}</h3>}
            <MusicalAddress address={address} />
          </div>
          {/* <Link to="/keys" className={styles.keys}>
            <img src={require('../../../image/keplr-icon.svg')} alt="Keplr" />
          </Link> */}
        </div>
      </ContainerGradientText>
    </header>
  );
}

export default RobotHeader;
