import Tooltip from '../../../components/tooltip/tooltip';
import share from '../../../image/share.svg';
import telegram from './telegram-icon.svg';
import { LinkWindow } from '../../../components/link/link';
import useMediaQuery from '../../../hooks/useMediaQuery';
import React from 'react';
import styles from './Telegram.module.scss';

export function Telegram() {
  // const mediaQuery = useMediaQuery('(min-width: 768px)');

  if (true) {
    return (
      <div
        // id="github-bar"
        className={styles.wrapper}
        style={{
          display: 'flex',
          // position: 'fixed',
          // left: '0',
          // bottom: 0,
          // margin: '0px 0px 28px 20px',
          // fontSize: '14px',
          // background: '#000c',
          // zIndex: 4,
          // marginLeft: 15,
        }}
      >
        <LinkWindow to="https://t.me/cyber">
          <img
            alt="telegram"
            style={{ width: 30, height: 30 }}
            src={telegram}
          />

          <span>t/uncensored</span>
        </LinkWindow>

        <LinkWindow to="https://t.me/CyberGlobalHub">
          <img
            alt="telegram"
            style={{ width: 30, height: 30 }}
            src={telegram}
          />

          <span>t/community</span>
        </LinkWindow>

        <LinkWindow to="https://t.me/bostrom_news">
          <img
            alt="telegram"
            style={{ width: 30, height: 30 }}
            src={telegram}
          />

          <span>t/news</span>
        </LinkWindow>
      </div>
    );
  }

  return (
    // <div
    // id="github-bar"
    // style={{
    //   // position: 'fixed',
    //   left: '0',
    //   bottom: 0,
    //   margin: '0px 0px 28px 20px',
    //   fontSize: '14px',
    //   background: '#000c',
    //   zIndex: 4,
    //   marginLeft: 15,
    // }}
    // >
    <Tooltip
      hideBorder
      placement="right"
      tooltip={
        <div
          style={
            {
              // display: 'flex',
              // alignItems: 'center',
              // fontSize: '14px',
              // gap: '20px',
              // background: '#000c',
              // padding: 5,
            }
          }
        >
          <LinkWindow to="https://t.me/cyber">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#36D6AE',
                whiteSpace: 'nowrap',
              }}
            >
              feedback{' '}
              <img alt="share" style={{ width: 20, height: 20 }} src={share} />
            </div>
          </LinkWindow>
          <LinkWindow to="https://t.me/cyber">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#36D6AE',
                whiteSpace: 'nowrap',
              }}
            >
              join movement{' '}
              <img alt="share" style={{ width: 20, height: 20 }} src={share} />
            </div>
          </LinkWindow>
        </div>
      }
    >
      <LinkWindow to="https://t.me/cyber">
        <div>
          <img
            alt="telegram"
            style={{ width: 30, height: 30 }}
            src={telegram}
          />
        </div>
      </LinkWindow>
    </Tooltip>
    // {/* </div> */}
  );
}
