import React, { useMemo, useRef } from 'react';
import cx from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Transition } from 'react-transition-group';

import useOnClickOutside from 'src/hooks/useOnClickOutside';
import { routes } from 'src/routes';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';

import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import Pill from 'src/components/Pill/Pill';
import { useSigningClient } from 'src/contexts/signerClient';
import { AvataImgIpfs } from '../../../portal/components/avataIpfs';
import styles from './SwitchAccount.module.scss';
import networkStyles from '../SwitchNetwork/SwitchNetwork.module.scss';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import robot from '../../../../image/temple/robot.png';
import Karma from '../../Karma/Karma';
import { setDefaultAccount } from '../../../../redux/features/pocket';
import { useBackend } from 'src/contexts/backend/backend';

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
  const location = useLocation();

  const { passport } = usePassportByAddress(address);

  const name =
    passport?.extension?.nickname || data?.cyber?.name || accountName;

  const nickname = passport?.extension?.nickname;

  function handleClick() {
    onClickSetActive?.();
    setControlledVisible(false);
  }

  const robotPath = nickname
    ? routes.robotPassport.getLink(nickname)
    : routes.robot.path;

  const linkToRobot = location.pathname.includes('@') ? robotPath : undefined;

  return (
    <Link
      to={link || linkToRobot}
      onClick={handleClick}
      className={cx(
        styles.containerSwichAccount,
        networkStyles.btnContainerText
      )}
    >
      <div className={cx(networkStyles.containerInfoSwitch, styles.content)}>
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
  const { signerReady } = useSigningClient();
  const { isIpfsInitialized } = useBackend();
  const mediaQuery = useMediaQuery('(min-width: 768px)');

  const [controlledVisible, setControlledVisible] = React.useState(false);

  const { defaultAccount, accounts } = useAppSelector((state) => state.pocket);
  const dispatch = useAppDispatch();

  const useGetAddress = defaultAccount?.account?.cyber?.bech32 || null;

  const { passport } = usePassportByAddress(useGetAddress);

  const { getTooltipProps, setTooltipRef, visible } = usePopperTooltip({
    trigger: 'click',
    closeOnTriggerHidden: true,
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
    placement: 'bottom',
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => {
    setControlledVisible(false);
  });

  const useGetCidAvatar = passport?.extension.avatar;
  const useGetName = passport?.extension.nickname || defaultAccount?.name;
  const isReadOnly = defaultAccount.account?.cyber.keys === 'read-only';

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
  }, [accounts, defaultAccount, isIpfsInitialized]);

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
          <div
            className={cx(
              networkStyles.containerInfoSwitch,
              isReadOnly || !signerReady
                ? networkStyles.containerInfoSwitchGapUnSet
                : undefined
            )}
          >
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
            {isReadOnly && <Pill color="yellow" text="read only" />}
            {!isReadOnly && !signerReady && (
              <Pill color="red" text="switch keplr" />
            )}
            <Karma address={useGetAddress} />
          </div>
        )}
        <Link
          to={
            passport
              ? routes.robotPassport.getLink(passport.extension.nickname)
              : routes.robot.path
          }
          // onClick={() => setControlledVisible(!controlledVisible)}
        >
          <div
            className={cx(styles.containerAvatarConnect, {
              [styles.containerAvatarConnectFalse]: !isIpfsInitialized,
              [styles.containerAvatarConnectTrueGreen]: isIpfsInitialized,
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
