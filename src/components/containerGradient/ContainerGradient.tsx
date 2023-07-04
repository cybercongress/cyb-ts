import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import cx from 'classnames';

import styles from './ContainerGradient.module.scss';
import { trimString } from '../../utils/utils';

const classNames = require('classnames');

function ContainerLamp({ style, children }) {
  return (
    <div
      className={classNames(styles.wrapContainerLamp, {
        [styles.wrapContainerLampGreen]: style === 'green',
        [styles.wrapContainerLampBlue]: style === 'blue' || style === 'grey',
        [styles.wrapContainerLampRed]: style === 'red',
        [styles.wrapContainerLampYellow]: style === 'yellow',
        [styles.wrapContainerLampPurple]: style === 'purple',
        [styles.wrapContainerLampPink]: style === 'pink',
        [styles.wrapContainerLampDefault]: !style,
      })}
    >
      {children}
    </div>
  );
}

function ContainerLampAfter({ style, children }) {
  return (
    <div
      className={classNames(styles.wrapContainerLampAfter, {
        [styles.wrapContainerLampAfterGreen]: style === 'green',
        [styles.wrapContainerLampAfterBlue]: style === 'blue',
        [styles.wrapContainerLampAfterRed]: style === 'red',
        [styles.wrapContainerLampAfterYellow]: style === 'yellow',
        [styles.wrapContainerLampAfterPurple]: style === 'purple',
        [styles.wrapContainerLampAfterDefault]: !style,
      })}
    >
      {children}
    </div>
  );
}

function ContainerLampBefore({ style, children }) {
  return (
    <div
      className={classNames(styles.wrapContainerLampBefore, {
        [styles.wrapContainerLampBeforeGreen]: style === 'green',
        [styles.wrapContainerLampBeforeBlue]: style === 'blue',
        [styles.wrapContainerLampBeforeRed]: style === 'red',
        [styles.wrapContainerLampBeforeYellow]: style === 'yellow',
        [styles.wrapContainerLampBeforePurple]: style === 'purple',
        [styles.wrapContainerLampBeforeDefault]: !style,
      })}
    >
      {children}
    </div>
  );
}

function TxsStatus({ data }) {
  let style;
  switch (data.status) {
    case 'pending':
      style = 'yellow';
      break;
    case 'confirmed':
      style = 'green';
      break;
    case 'error':
      style = 'red';
      break;

    default:
      break;
  }
  return (
    <ContainerLamp style={style}>
      <div
        className={classNames(styles.containerTxs, {
          [styles.containerTxsPending]: data.status === 'pending',
          [styles.containerTxsConfirmed]: data.status === 'confirmed',
          [styles.containerTxsDanger]: data.status === 'error',
        })}
      >
        {data.txHash && (
          <div className={styles.containerTxsTxHash}>
            <Link to={`/network/bostrom/tx/${data.txHash}`}>
              <div>{trimString(data.txHash, 5, 5)}</div>
            </Link>
            {/* <div>5 min ago</div> */}
            <div>{data.status}</div>
          </div>
        )}
        {data.rawLog && (
          <div className={styles.containerTxsRawLog}>{data.rawLog}</div>
        )}
      </div>
    </ContainerLamp>
  );
}

export type ColorLamp = 'blue' | 'red' | 'green' | 'pink' | 'grey';

type ContainerGradientText = {
  children: React.ReactNode;
  userStyleContent?: object;
  status?: ColorLamp;
  className?: string;
};

export function ContainerGradientText({
  children,
  userStyleContent = {},
  className,
  status = 'blue',
}: ContainerGradientText) {
  return (
    <ContainerLamp style={status}>
      <div
        className={classNames(styles.containerGradientText, {
          [styles.containerGradientTextPrimary]: status === 'blue',
          [styles.containerGradientTextDanger]: status === 'red',
          [styles.containerGradientTextGreen]: status === 'green',
          [styles.containerGradientTextPink]: status === 'pink',
          [styles.containerGradientTextGrey]: status === 'grey',
        })}
      >
        <div
          style={userStyleContent}
          className={cx(styles.containerGradientTextContent, className)}
        >
          {children}
        </div>
      </div>
    </ContainerLamp>
  );
}

interface Props {
  title?: string;
  closedTitle?: string;
  children?: React.ReactNode;
  txs?: any;
  danger?: boolean;
  userStyleContent?: React.CSSProperties;
  stateOpen?: boolean;
  initState?: boolean;
  styleLampContent?: string;
  styleLampTitle?: any;
  togglingDisable?: any;
}

function ContainerGradient({
  title = 'Moon Citizenship',
  closedTitle,
  children,
  txs,
  danger,
  userStyleContent,
  stateOpen,
  initState = true,
  styleLampContent = 'blue',
  styleLampTitle,
  togglingDisable,
}: Props) {
  const [isOpen, setIsOpen] = useState(initState);

  useEffect(() => {
    if (stateOpen !== undefined) {
      setIsOpen(stateOpen);
    }
  }, [stateOpen]);

  const toggling = () => {
    if (togglingDisable === undefined || togglingDisable === false) {
      return setIsOpen(!isOpen);
    }
    return undefined;
  };

  const useTitle = useCallback(
    (state) => {
      if (
        !isOpen &&
        closedTitle &&
        closedTitle !== null &&
        state === 'exited'
      ) {
        return closedTitle;
      }
      if (state === 'entered') {
        return title;
      }

      return title;
    },
    [isOpen, closedTitle, title]
  );

  return (
    <div>
      <ContainerLampAfter style={styleLampContent}>
        <div
          className={classNames(styles.containerContainerGradient, {
            [styles.togglingDisable]: togglingDisable,
            [styles.containerContainerGradientPrimary]: !styleLampContent,
            [styles.containerContainerGradientPrimary]:
              styleLampContent === 'blue',
            [styles.containerContainerGradientDanger]:
              styleLampContent === 'red',
            [styles.containerContainerGradientPurple]:
              styleLampContent === 'purple',
            [styles.containerContainerGradientGreen]:
              styleLampContent === 'green',
          })}
        >
          <Transition in={isOpen} timeout={500}>
            {(state) => {
              return (
                <>
                  <ContainerLampBefore style={styleLampTitle}>
                    <div
                      onClick={() => toggling()}
                      role="presentation"
                      className={classNames(
                        styles.containerContainerGradientTitle,
                        {
                          [styles.containerContainerGradientTitlePrimary]:
                            !styleLampTitle,
                          [styles.containerContainerGradientTitleDanger]:
                            styleLampTitle === 'red',
                          [styles.containerContainerGradientTitleGreen]:
                            styleLampTitle === 'green',
                        }
                      )}
                    >
                      <div
                        className={classNames(
                          styles.containerContainerGradientTitleContent,
                          styles[
                            `containerContainerGradientTitleContent${state}`
                          ]
                        )}
                      >
                        {/*  eslint-disable-next-line react-hooks/rules-of-hooks */}
                        {useTitle(state)}
                      </div>
                    </div>
                  </ContainerLampBefore>
                  <ContainerLampBefore style={styleLampContent}>
                    <div
                      style={userStyleContent}
                      className={classNames(
                        styles.containerContainerGradientContent,
                        {
                          [styles.containerContainerGradientContentPrimary]:
                            !styleLampContent,
                          [styles.containerContainerGradientContentPrimary]:
                            styleLampContent === 'blue',
                          [styles.containerContainerGradientContentDanger]:
                            styleLampContent === 'red',
                          [styles.containerContainerGradientContentPurple]:
                            styleLampContent === 'purple',
                          [styles.containerContainerGradientContentGreen]:
                            styleLampContent === 'green',
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
      {txs && txs !== null && <TxsStatus data={txs} />}
    </div>
  );
}

export default ContainerGradient;
