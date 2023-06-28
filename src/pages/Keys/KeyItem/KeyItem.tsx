import { ContainerGradientText } from 'src/components';
import Pill, { Colors } from 'src/components/Pill/Pill';
import { Signatures } from 'src/containers/portal/components';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { AccountValue } from 'src/types/defaultAccount';
import styles from './KeyItem.module.scss';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';

type Props = {
  account: AccountValue;
};

function KeyItem({ account }: Props) {
  const { name, bech32, keys, path } = account;

  const { passport } = useGetPassportByAddress(bech32);

  const isReadOnly = keys === 'read-only';
  const isHardware = keys === 'ledger';

  return (
    <ContainerGradientText status="green">
      <div className={styles.wrapper}>
        <img src={require('./images/1.png')} alt="" />

        <div>
          key <Pill color={Colors.white} text={name} /> <br />
          signed by <Pill color={Colors.red} text={keys} />{' '}
          {isHardware && (
            <>
              stored in <Pill color={Colors.red} text={keys} />
            </>
          )}{' '}
          {path && (
            <>
              and located at the path <Pill text={path.join('/')} />
            </>
          )}
          <br />
          from neuron <Signatures addressActive={{ bech32 }} /> <br />
          gives{' '}
          <Pill
            color={isReadOnly ? Colors.blue : Colors.green}
            text={isReadOnly ? 'read' : 'write'}
          />{' '}
          access to avatar: <br />
          {passport && (
            <Pill
              // image={<AvataImgIpfs cidAvatar={passport.extension.avatar} />}
              image={{
                src: passport.extension.avatar,
                alt: passport.extension.nickname,
              }}
              text={passport.extension.nickname}
            />
          )}
        </div>
      </div>
    </ContainerGradientText>
  );
}

export default KeyItem;
