import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import styles from './ContainerGradient.module.scss';
import { trimString } from '../../utils/utils';
import Display from './Display/Display';
import { ColorLamp } from './types';
import DisplayTitle from './DisplayTitle/DisplayTitle';

const classNames = require('classnames');

export function ContainerLamp({ style, children }) {
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
        [styles.wrapContainerLampAfterDefault]: !style || style === 'grey',
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
        [styles.wrapContainerLampBeforeDefault]: !style || style === 'grey',
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

interface Props {
  title?: string;
  closedTitle?: string;

  children?: React.ReactNode;
  txs?: any;
  userStyleContent?: React.CSSProperties;
  stateOpen?: boolean;
  initState?: boolean;
  styleLampContent?: ColorLamp;
  styleLampTitle?: ColorLamp;
  togglingDisable?: boolean;
}

function ContainerGradient({
  title = 'Moon Citizenship',
  closedTitle,
  children,
  txs,
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
      {/* TODO: use Display component */}
      <ContainerLampAfter style={styleLampContent}>
        <div
          className={classNames(styles.containerContainerGradient, {
            [styles.togglingDisable]: togglingDisable,
            [styles.containerContainerGradientPrimary]: !styleLampContent,
            [styles.containerContainerGradientPrimary]:
              styleLampContent === 'blue',
            [styles.containerContainerGradientDanger]:
              styleLampContent === 'red',
            [styles.containerContainerGradientGreen]:
              styleLampContent === 'green',
          })}
        >
          <Transition in={isOpen} timeout={500}>
            {(state) => {
              return (
                <>
                  <div
                    onClick={!togglingDisable ? toggling : undefined}
                    role={!togglingDisable ? 'presentation' : undefined}
                    className={classNames({
                      [styles.titleTogglingActive]: !togglingDisable,
                    })}
                  >
                    <DisplayTitle
                      title={useTitle(state)}
                      animationState={state}
                      color={styleLampTitle}
                    />
                  </div>

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

export const ContainerGradientText = Display;
export const Display2 = ContainerGradient;

export default ContainerGradient;
