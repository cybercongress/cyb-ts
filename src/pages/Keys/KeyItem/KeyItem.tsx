import { ContainerGradientText } from 'src/components';
import Pill, { Colors } from 'src/components/Pill/Pill';
import { Signatures } from 'src/containers/portal/components';
import { AccountValue } from 'src/types/defaultAccount';
import styles from './KeyItem.module.scss';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import usePassportContract from 'src/hooks/usePassportContract';
import { Citizenship } from 'src/types/citizenship';

type Props = {
  account: AccountValue;
};

function PassportLoader({
  tokenId,
  render,
}: {
  tokenId: string;
  render: (passport: Citizenship) => JSX.Element | null;
}) {
  const { data: passport } = usePassportContract<Citizenship>({
    query: {
      nft_info: {
        token_id: tokenId,
      },
    },
  });

  if (!passport) {
    return null;
  }

  return render(passport);
}

function KeyItem({ account }: Props) {
  const { name, bech32, keys, path } = account;

  const { data: activePassport } = usePassportContract<Citizenship>({
    query: {
      active_passport: {
        address: bech32,
      },
    },
  });

  const { data: passportIds } = usePassportContract<{ tokens: string[] }>({
    query: {
      tokens: {
        owner: bech32,
      },
    },
  });

  const isReadOnly = keys === 'read-only';
  const isHardware = keys === 'ledger';

  function renderPassportPill({
    extension: { nickname, avatar },
  }: Citizenship) {
    return (
      <Link to={routes.robotPassport.getLink(nickname)}>
        <Pill image={<AvataImgIpfs cidAvatar={avatar} />} text={nickname} />
      </Link>
    );
  }

  return (
    <ContainerGradientText status="green">
      <div className={styles.wrapper}>
        <img src={require('./images/1.png')} alt="" />

        <div className={styles.content}>
          key <Pill color={Colors.white} text={name || 'noname'} /> <br />
          {['keplr'].includes(keys) && (
            <>
              signed by <Pill color={Colors.red} text={keys} />{' '}
            </>
          )}
          {isHardware && (
            <>
              stored in <Pill color={Colors.red} text={keys} />
            </>
          )}{' '}
          {path && (
            <>
              and located at the path <Pill text={path.join('/')} /> <br />
            </>
          )}
          from neuron <Pill text={<Signatures addressActive={{ bech32 }} />} />{' '}
          <br />
          gives{' '}
          <Pill
            color={isReadOnly ? Colors.blue : Colors.green}
            text={isReadOnly ? 'read' : 'write'}
          />{' '}
          access
          {(passportIds?.tokens.length || activePassport) && (
            <>
              {' '}
              to avatars: <br />
            </>
          )}
          {activePassport && renderPassportPill(activePassport)}
          {passportIds?.tokens?.map((tokenId) => {
            return (
              <PassportLoader
                key={tokenId}
                tokenId={tokenId}
                render={(passport) => {
                  if (
                    activePassport &&
                    JSON.stringify(passport.extension) ===
                      JSON.stringify(activePassport.extension)
                  ) {
                    return null;
                  }
                  return renderPassportPill(passport);
                }}
              />
            );
          })}
        </div>
      </div>
    </ContainerGradientText>
  );
}

export default KeyItem;
