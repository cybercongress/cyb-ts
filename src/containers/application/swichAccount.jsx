import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Transition } from 'react-transition-group';
import { AvataImgIpfs } from '../portal/components/avataIpfs';
import useGetPassportByAddress from '../sigma/hooks/useGetPassportByAddress';
import styles from './styles.scss';
import robot from '../../image/temple/robot.jpg';

function AccountItem({ data, node, onClickSetActive, name }) {
  const { passport } = useGetPassportByAddress(data);

  const useGetName = useMemo(() => {
    if (passport && passport !== null) {
      return passport.extension.nickname;
    }

    if (name) {
      return name;
    }

    return null;
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
    return '';
  }, [data]);

  return (
    <button
      type="button"
      onClick={onClickSetActive}
      className={cx(
        styles.containerSwichAccount,
        styles.btnContainerText,
        styles.containerSwichAccountHover
      )}
      style={{ marginTop: -10 }}
    >
      {useGetName !== null && (
        <button
          className={cx(styles.btnContainerText, styles.btnContainerTextHover)}
          type="button"
        >
          {useGetName}
        </button>
      )}

      <div
        className={cx(
          styles.containerAvatarConnect,
          styles.containerAvatarConnectTrue,
          styles.containerAvatarConnectHover
        )}
      >
        <AvataImgIpfs
          style={{ position: 'relative' }}
          cidAvatar={useGetCidAvatar}
          node={node}
          addressCyber={useGetAddress}
        />
      </div>
    </button>
  );
}

function SwichAccount({
  defaultAccount,
  accounts,
  node,
  ipfsStatus,
  onClickChangeActiveAcc,
}) {
  const [controlledVisible, setControlledVisible] = React.useState(false);

  // se;

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      trigger: 'click',
      closeOnOutsideClick: false,
      visible: controlledVisible,
      onVisibleChange: setControlledVisible,
      placement: 'bottom',
    });
  const { passport } = useGetPassportByAddress(defaultAccount);

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
    let items = {};

    if (accounts && accounts !== null) {
      items = Object.keys(accounts)
        .filter((item) => defaultAccount.name !== item)
        .map((key, i) => {
          return (
            <AccountItem
              key={key}
              data={accounts[key]}
              onClickSetActive={() =>
                onClickChangeActiveAcc(key, accounts[key])
              }
              node={node}
              // ipfsStatus={ipfsStatus}
              name={key}
            />
          );
        });
    }

    return items;
  }, [accounts, defaultAccount, node]);

  // return items;

  return (
    <div style={{ position: 'relative', fontSize: '20px' }}>
      <div
        className={styles.containerSwichAccount}
        style={{
          gridTemplateColumns: useGetName === null ? '1fr' : '1fr 100px',
        }}
      >
        {useGetName !== null && (
          <button
            onClick={() => setControlledVisible((item) => !item)}
            className={styles.btnContainerText}
            type="button"
            style={{ fontSize: '20px' }}
          >
            {useGetName}
          </button>
        )}
        <Link to="/robot">
          <div
            className={cx(styles.containerAvatarConnect, {
              [styles.containerAvatarConnectFalse]: !ipfsStatus,
              [styles.containerAvatarConnectTrueGreen]: ipfsStatus,
            })}
          >
            <AvataImgIpfs
              style={{ position: 'relative', objectFit: 'contain' }}
              cidAvatar={useGetCidAvatar}
              node={node}
              addressCyber={useGetAddress}
              img={robot}
            />
          </div>
        </Link>
      </div>
      {Object.keys(renderItem).length > 0 && (
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
                    styles[`containerSwichAccountList${state}`],
                  ])}
                >
                  {renderItem}
                </div>
              </div>
            );
          }}
        </Transition>
      )}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
    ipfsStatus: store.ipfs.statusIpfs,
  };
};

export default connect(mapStateToProps)(SwichAccount);
