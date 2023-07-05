import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';

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

export function ContainerLampAfter({ style, children }) {
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

export function ContainerLampBefore({ style, children }) {
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
};

export function ContainerGradientText({
  children,
  userStyleContent,
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
          className={styles.containerGradientTextContent}
        >
          {children}
        </div>
      </div>
    </ContainerLamp>
  );
}

type ContainerGradientBeforeOrAfter = {
  children: React.ReactNode;
  userStyleContent?: object;
  status?: ColorLamp;
  type: 'before' | 'after';
};

export function ContainerGradientBeforeOrAfter({
  children,
  userStyleContent,
  status = 'blue',
  type = 'before',
}: ContainerGradientBeforeOrAfter) {
  const Tag = type === 'before' ? ContainerLampBefore : ContainerLampAfter;
  return (
    <Tag style={status}>
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
          className={styles.containerGradientTextContent}
        >
          {children}
        </div>
      </div>
    </Tag>
  );
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
}) {
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
        // setTimeout(() => {
        //   console.log('first', first)
        // }, 500);
        return closedTitle;
      }
      // setTimeout(() => {
      if (state === 'entered') {
        return title;
      }

      return undefined;
      // }, 500);
    },
    [isOpen, closedTitle, title]
  );

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
