import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import styles from './style.scss';
import { trimString } from '../../../../utils/utils';

const classNames = require('classnames');

const ContainerLamp = ({ style, children }) => (
  <div
    className={classNames(styles.wrapContainerLamp, {
      [styles.wrapContainerLampGreen]: style === 'green',
      [styles.wrapContainerLampBlue]: style === 'blue',
      [styles.wrapContainerLampRed]: style === 'red',
      [styles.wrapContainerLampYellow]: style === 'yellow',
      [styles.wrapContainerLampDefault]: !style,
    })}
  >
    {children}
  </div>
);

const ContainerLampAfter = ({ style, children }) => (
  <div
    className={classNames(styles.wrapContainerLampAfter, {
      [styles.wrapContainerLampAfterGreen]: style === 'green',
      [styles.wrapContainerLampAfterBlue]: style === 'blue',
      [styles.wrapContainerLampAfterRed]: style === 'red',
      [styles.wrapContainerLampAfterYellow]: style === 'yellow',
      [styles.wrapContainerLampAfterDefault]: !style,
    })}
  >
    {children}
  </div>
);

const ContainerLampBefore = ({ style, children }) => (
  <div
    className={classNames(styles.wrapContainerLampBefore, {
      [styles.wrapContainerLampBeforeGreen]: style === 'green',
      [styles.wrapContainerLampBeforeBlue]: style === 'blue',
      [styles.wrapContainerLampBeforeRed]: style === 'red',
      [styles.wrapContainerLampBeforeYellow]: style === 'yellow',
      [styles.wrapContainerLampBeforeDefault]: !style,
    })}
  >
    {children}
  </div>
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
  styleLampContent = 'blue',
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
    <div>
      <ContainerLampAfter style={styleLampContent}>
        <div
          className={classNames(styles.containerContainerGradient, {
            [styles.containerContainerGradientPrimary]: !styleLampContent,
            [styles.containerContainerGradientPrimary]:
              styleLampContent === 'blue',
            [styles.containerContainerGradientDanger]:
              styleLampContent === 'red',
          })}
        >
          <Transition in={isOpen} timeout={500}>
            {(state) => {
              return (
                <>
                  <ContainerLampBefore>
                    <div
                      onClick={() => toggling()}
                      role="presentation"
                      className={styles.containerContainerGradientTitle}
                    >
                      <div
                        className={classNames(
                          styles.containerContainerGradientTitleContent,
                          styles[
                            `containerContainerGradientTitleContent${state}`
                          ]
                        )}
                      >
                        {useTitle}
                      </div>
                    </div>
                  </ContainerLampBefore>
                  <ContainerLampBefore style={styleLampContent}>
                    <div
                      style={userStyleContent}
                      className={classNames(
                        styles.containerContainerGradientContent,
                        {
                          [styles.containerContainerGradientContentPrimary]: !styleLampContent,
                          [styles.containerContainerGradientContentPrimary]:
                            styleLampContent === 'blue',
                          [styles.containerContainerGradientContentDanger]:
                            styleLampContent === 'red',
                        },
                        styles[`containerContainerGradientContent${state}`]
                      )}
                    >
                      {children}
                    </div>
                  </ContainerLampBefore>
                </>
              );
            }}
          </Transition>
        </div>
      </ContainerLampAfter>
      {txs && txs !== null && (
        <ContainerLamp>
          <TxsStatus data={txs} />
        </ContainerLamp>
      )}
    </div>
  );
}

export default ContainerGradient;
