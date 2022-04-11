import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import styles from './style.scss';
import { trimString } from '../../../../utils/utils';

const classNames = require('classnames');

const ContainerLamp = ({ children }) => (
  <div className={styles.wrapContainerLamp}>{children}</div>
);

const TxsStatus = ({ data }) => {
  return (
    <div
      className={classNames(styles.containerTxs, {
        [styles.containerTxsPending]: data.status === 'pending',
        [styles.containerTxsConfirmed]: data.status === 'confirmed',
        [styles.containerTxsDanger]: data.status === 'error',
      })}
    >
      <div className={styles.containerTxsTxHash}>
        <Link to={`/network/bostrom/tx/${data.txHash}`}>
          <div>{trimString(data.txHash, 5, 5)}</div>
        </Link>
        {/* <div>5 min ago</div> */}
        <div>{data.status}</div>
      </div>
      {data.rawLog && (
        <div className={styles.containerTxsRawLog}>{data.rawLog}</div>
      )}
    </div>
  );
};

export const ContainerGradientText = ({ children, status = 'primary' }) => {
  return (
    <ContainerLamp>
      <div
        className={classNames(styles.containerGradientText, {
          [styles.containerGradientTextPrimary]: status === 'primary',
          [styles.containerGradientTextDanger]: status === 'danger',
          [styles.containerGradientTextGreen]: status === 'green',
        })}
      >
        <div className={styles.containerGradientTextContent}>{children}</div>
      </div>
    </ContainerLamp>
  );
};

function ContainerGradient({
  title = 'Moon Citizenship',
  closedTitle,
  children,
  txs,
  danger,
  userStyleContent,
  stateOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(stateOpen);

  const toggling = () => setIsOpen(!isOpen);

  const useTitle = useMemo(() => {
    if (!isOpen && closedTitle && closedTitle !== null) {
      return closedTitle;
    }
    return title;
  }, [isOpen, closedTitle, title]);

  return (
    <ContainerLamp>
      <div
        className={classNames(styles.containerContainerGradient, {
          [styles.containerContainerGradientPrimary]: !danger,
          [styles.containerContainerGradientDanger]: danger,
        })}
      >
        <Transition in={isOpen} timeout={500}>
          {(state) => {
            return (
              <>
                <div
                  onClick={() => toggling()}
                  role="presentation"
                  className={styles.containerContainerGradientTitle}
                >
                  <div
                    className={classNames(
                      styles.containerContainerGradientTitleContent,
                      styles[`containerContainerGradientTitleContent${state}`]
                    )}
                  >
                    {useTitle}
                  </div>
                </div>

                <div
                  style={userStyleContent}
                  className={classNames(
                    styles.containerContainerGradientContent,
                    {
                      [styles.containerContainerGradientContentPrimary]: !danger,
                      [styles.containerContainerGradientContentDanger]: danger,
                    },
                    styles[`containerContainerGradientContent${state}`]
                  )}
                >
                  {children}
                </div>
              </>
            );
          }}
        </Transition>
      </div>
      {txs && txs !== null && <TxsStatus data={txs} />}
    </ContainerLamp>
  );
}

export default ContainerGradient;
