import React, { useEffect, useMemo, useRef } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Transition } from 'react-transition-group';
import { useIpfs } from 'src/contexts/ipfs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { AvataImgIpfs } from '../../../portal/components/avataIpfs';
import useGetPassportByAddress from '../../../sigma/hooks/useGetPassportByAddress';
import styles from './SwitchAccount.module.scss';
import networkStyles from '../SwitchNetwork/SwitchNetwork.module.scss';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import robot from '../../../../image/temple/robot.png';
import Karma from '../../Karma/Karma';
import {
  setAccounts,
  setDefaultAccount,
} from '../../../../redux/features/pocket';
import {
  setPassport,
  setPassportLoading,
} from 'src/features/passport/passport.redux';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import { routes } from 'src/routes';

function AccountItem({
  data,
  onClickSetActive,
  setControlledVisible,
  name: accountName,
}) {
  const { passport } = useGetPassportByAddress(data);

  const name =
    passport?.extension?.nickname || data?.cyber?.name || accountName;

  const address = data?.cyber?.bech32;

  function handleClick() {
    onClickSetActive();
    setControlledVisible(false);
  }

  return (
    <Link
      to={routes.robot.path}
      onClick={handleClick}
      className={cx(
        styles.containerSwichAccount,
        networkStyles.btnContainerText
      )}
    >
      <div className={networkStyles.containerKrmaName}>
        {name && (
          <span className={cx(networkStyles.btnContainerText)}>{name}</span>
        )}
        {address && <Karma address={address} />}
      </div>
      <div className={cx(styles.containerAvatarConnect)}>
        <div className={styles.containerAvatarConnectTrue}>
          <AvataImgIpfs
            style={{ position: 'relative' }}
            cidAvatar={passport?.extension?.avatar}
            addressCyber={address}
          />
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

  const { passport } = useGetPassportByAddress(
    defaultAccount?.account?.cyber?.bech32
  );

  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => {
    setControlledVisible(false);
  });

  useEffect(() => {
    dispatch(setPassportLoading());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setPassport(passport));
  }, [passport, dispatch]);

  const onClickChangeActiveAcc = async (key: string) => {
    if (
      accounts !== null &&
      Object.prototype.hasOwnProperty.call(accounts, key)
    ) {
      const defaultAccountTemp = { [key]: accounts[key] };
      const accountsPocket = {
        [key]: accounts[key],
        ...accounts,
      };
      dispatch(
        setDefaultAccount({
          name: key,
          account: accounts[key],
        })
      );
      dispatch(setAccounts(accountsPocket));
      setControlledVisible(false);
      localStorage.setItem('pocket', JSON.stringify(defaultAccountTemp));
    }
  };

  const useGetName = useMemo(() => {
    if (passport && passport !== null) {
      return passport.extension.nickname;
    }

    if (defaultAccount !== null) {
      return defaultAccount.name;
    }

    return null;
  }, [passport, defaultAccount]);

  const useGetCidAvatar = useMemo(() => {
    if (passport && passport !== null) {
      return passport.extension.avatar;
    }
    return null;
  }, [passport]);

  const useGetAddress = useMemo(() => {
    if (
      defaultAccount !== null &&
      Object.prototype.hasOwnProperty.call(defaultAccount, 'account')
    ) {
      const { account } = defaultAccount;
      if (
        account !== null &&
        Object.prototype.hasOwnProperty.call(account, 'cyber')
      ) {
        const { bech32 } = account.cyber;
        return bech32;
      }
    }

    return null;
  }, [defaultAccount]);

  const renderItem = useMemo(() => {
    if (!accounts) {
      return null;
    }

    return Object.keys(accounts)
      .filter((item) => defaultAccount.name !== item)
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

  const multipleAccounts = renderItem && Object.keys(renderItem).length > 0;

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
          </div>
        )}
        <Link
          to={routes.robot.path}
          onClick={() => setControlledVisible(!controlledVisible)}
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
      {multipleAccounts && (
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

                  <Link style={{ color: 'red' }} to={routes.sigma.path}>
                    Sigma
                  </Link>

                  <Link style={{ color: 'red' }} to={routes.keys.path}>
                    Keys
                  </Link>
                </div>
              </div>
            );
          }}
        </Transition>
      )}
    </div>
  );
}

export default SwitchAccount;
