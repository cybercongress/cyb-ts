import React, { useMemo, useRef } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Transition } from 'react-transition-group';
import { useIpfs } from 'src/contexts/ipfs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

import useOnClickOutside from 'src/hooks/useOnClickOutside';
import { routes } from 'src/routes';
import { AvataImgIpfs } from '../../../portal/components/avataIpfs';
import useGetPassportByAddress from '../../../sigma/hooks/useGetPassportByAddress';
import styles from './SwitchAccount.module.scss';
import networkStyles from '../SwitchNetwork/SwitchNetwork.module.scss';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import robot from '../../../../image/temple/robot.png';
import Karma from '../../Karma/Karma';
import ChatBotPanel from '../ChatBotPanel/ChatBotPanel';
import { setDefaultAccount } from '../../../../redux/features/pocket';

// should be refactored
function AccountItem({
  data,
  onClickSetActive,
  setControlledVisible,
  name: accountName,
  image,
  link,
}) {
  const address = data?.cyber?.bech32;
  const { passport } = useGetPassportByAddress(address);

  const name =
    passport?.extension?.nickname || data?.cyber?.name || accountName;

  const nickname = passport?.extension?.nickname;

  function handleClick() {
    onClickSetActive?.();
    setControlledVisible(false);
  }

  return (
    <Link
      to={
        link ||
        (nickname && routes.robotPassport.getLink(nickname)) ||
        routes.robot.path
      }
      onClick={handleClick}
      className={cx(
        styles.containerSwichAccount,
        networkStyles.btnContainerText
      )}
    >
      <div className={cx(networkStyles.containerKrmaName, styles.content)}>
        {name && (
          <span
            className={cx(networkStyles.btnContainerText, {
              [styles.noAccount]: !address,
            })}
          >
            {name}
          </span>
        )}
        {address && <Karma address={address} />}
      </div>
      <div className={cx(styles.containerAvatarConnect)}>
        <div className={styles.containerAvatarConnectTrue}>
          {image ? (
            <img className={styles.image} src={image} alt={name} />
          ) : (
            <AvataImgIpfs
              style={{ position: 'relative' }}
              cidAvatar={passport?.extension?.avatar}
              addressCyber={address}
            />
          )}
        </div>
      </div>
    </Link>
  );
}

function SwitchAccount() {
  const { node, isReady: ipfsStatus } = useIpfs();
  const mediaQuery = useMediaQuery('(min-width: 768px)');
  const [controlledVisible, setControlledVisible] = React.useState(false);

  const { defaultAccount, accounts } = useSelector(
    (state: RootState) => state.pocket
  );

  const { getTooltipProps, setTooltipRef, visible } = usePopperTooltip({
    trigger: 'click',
    closeOnTriggerHidden: true,
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
    placement: 'bottom',
  });

  const passport = useSelector((state: RootState) => state.passport);
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => {
    setControlledVisible(false);
  });

  const useGetCidAvatar = passport.data?.extension.avatar;
  const useGetName = passport.data?.extension.nickname || defaultAccount?.name;
  const useGetAddress = defaultAccount?.account?.cyber?.bech32;

  const onClickChangeActiveAcc = async (key: string) => {
    dispatch(
      setDefaultAccount({
        name: key,
      })
    );
    setControlledVisible(false);
  };

  const renderItem = useMemo(() => {
    if (!accounts) {
      return null;
    }

    return Object.keys(accounts)
      .filter((item) => defaultAccount.name !== item && accounts[item].cyber)
      .map((key) => {
        return (
          <AccountItem
            key={key}
            data={accounts[key]}
            onClickSetActive={() => onClickChangeActiveAcc(key)}
            setControlledVisible={setControlledVisible}
            name={key}
          />
        );
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, defaultAccount, node]);

  // const multipleAccounts = renderItem && Object.keys(renderItem).length > 0;

  return (
    <div style={{ position: 'relative', fontSize: '20px' }} ref={containerRef}>
      <div
        className={styles.containerSwichAccount}
        style={{
          gridTemplateColumns:
            !useGetName || !mediaQuery || !useGetAddress ? '1fr' : '1fr 105px',
        }}
      >
        {mediaQuery && useGetAddress && (
          <div className={networkStyles.containerKrmaName}>
            {useGetName && (
              <button
                onClick={() => setControlledVisible((item) => !item)}
                className={networkStyles.btnContainerText}
                type="button"
                style={{ fontSize: '20px' }}
              >
                {useGetName}
                {/* {multipleAccounts && '>'} */}
              </button>
            )}

            <Karma address={useGetAddress} />
            <ChatBotPanel />
          </div>
        )}
        <Link
          to={
            passport.data
              ? routes.robotPassport.getLink(passport.data.extension.nickname)
              : routes.robot.path
          }
          // onClick={() => setControlledVisible(!controlledVisible)}
        >
          <div
            className={cx(styles.containerAvatarConnect, {
              [styles.containerAvatarConnectFalse]: !ipfsStatus,
              [styles.containerAvatarConnectTrueGreen]: ipfsStatus,
            })}
          >
            <AvataImgIpfs
              style={{
                position: 'relative',
                objectFit: !useGetCidAvatar && 'contain',
              }}
              cidAvatar={useGetCidAvatar}
              addressCyber={useGetAddress}
              img={robot}
            />
          </div>
        </Link>
      </div>
      <Transition in={visible} timeout={300}>
        {(state) => {
          return (
            <div
              ref={setTooltipRef}
              {...getTooltipProps({
                className: styles.tooltipContainerRight,
              })}
            >
              <div
                className={cx(styles.containerSwichAccountList, [
                  styles[`containerSwichAccountList_${state}`],
                ])}
              >
                {renderItem}

                <AccountItem
                  name="supersigma"
                  link={routes.sigma.path}
                  setControlledVisible={setControlledVisible}
                  image={require('../../../../image/sigma.png')}
                />
                <AccountItem
                  name="keys"
                  setControlledVisible={setControlledVisible}
                  link={routes.keys.path}
                  image={require('./keys.png')}
                />
              </div>
            </div>
          );
        }}
      </Transition>
    </div>
  );
}

export default SwitchAccount;
