import { ContainerGradientText } from 'src/components';
import styles from './RobotHeader.module.scss';
import { useRobotContext } from '../Robot';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import { Signatures } from 'src/containers/portal/components';
import { useState } from 'react';

function RobotHeader() {
  const [show, setShow] = useState(true);
  const { address, passport } = useRobotContext();

  const avatar = passport?.extension?.avatar;
  const nickname = passport?.extension?.nickname;

  return (
    <>
      <button
        style={{
          position: 'relative',
          zIndex: 10,
          marginBottom: 20,
        }}
        onClick={() => setShow(!show)}
      >
        {show ? 'Hide' : 'Show'} header
      </button>

      {show && (
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
            </div>
          </ContainerGradientText>
        </header>
      )}
    </>
  );
}

export default RobotHeader;
