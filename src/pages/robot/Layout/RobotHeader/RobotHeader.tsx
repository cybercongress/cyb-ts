import { ContainerGradientText } from 'src/components';
import styles from './RobotHeader.module.scss';
import { useRobotContext } from '../../robot.context';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import { Signatures } from 'src/containers/portal/components';
// import { Link } from 'react-router-dom';

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
            <Signatures
              addressActive={{
                bech32: address,
              }}
            />
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
