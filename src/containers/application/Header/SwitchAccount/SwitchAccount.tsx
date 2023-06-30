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
import { setPassport, setPassportLoading } from 'src/redux/features/passport';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import { routes } from 'src/routes';

function AccountItem({ data, onClickSetActive, setControlledVisible, name }) {
  const { passport } = useGetPassportByAddress(data);

  const useGetName = useMemo(() => {
    if (passport && passport !== null) {
      return passport.extension.nickname;
    }

    if (data?.cyber?.name) {
      return data.cyber.name;
    }

    if (name) {
      return name;
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passport]);

  const useGetCidAvatar = useMemo(() => {
    if (passport && passport !== null) {
      return passport.extension.avatar;
    }
    return '';
  }, [passport]);

  const useGetAddress = useMemo(() => {
    if (data !== null && Object.prototype.hasOwnProperty.call(data, 'cyber')) {
      const { bech32 } = data.cyber;
      return bech32;
    }
    return null;
  }, [data]);

  const hadleOnClick = () => {
    onClickSetActive();
    setControlledVisible(false);
  };

  return (
    <Link
      to={routes.robot.path}
      type="button"
      onClick={() => hadleOnClick()}
      className={cx(
        styles.containerSwichAccount,
        networkStyles.btnContainerText
      )}
    >
      <div className={networkStyles.containerKrmaName}>
        {useGetName && (
          <span className={cx(networkStyles.btnContainerText)}>
            {useGetName}
          </span>
        )}
        {useGetAddress && <Karma address={useGetAddress} />}
      </div>
      <div className={cx(styles.containerAvatarConnect)}>
        <div className={styles.containerAvatarConnectTrue}>
          <AvataImgIpfs
            style={{ position: 'relative' }}
            cidAvatar={useGetCidAvatar}
            addressCyber={useGetAddress}
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

  const { passport } = useGetPassportByAddress(defaultAccount);

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

                  <Link style={{ color: 'red' }} to={'/sigma'}>
                    Sigma
                  </Link>

                  <Link style={{ color: 'red' }} to={'/keys'}>
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
