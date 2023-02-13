import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ButtonIcon } from '../ledger/stageActionBar';
import BtnGrd from '../btnGrd';
import styles from './styles.scss';
import Tooltip from '../tooltip/tooltip';

import github from '../../image/github-mark-white.svg';
import star from '../../image/star-reg.svg';
import share from '../../image/share.svg';
import telegram from '../../image/telegram.png';
import { LinkWindow } from '../link/link';
import { formatNumber } from '../../utils/utils';
import useMediaQuery from '../../hooks/useMediaQuery';

const back = require('../../image/arrow-left-img.svg');

function ActionBarContainer({ children }) {
  return (
    <div className={styles.ActionBarContainer}>
      <div className={styles.ActionBarContainerContent}>{children}</div>
    </div>
  );
}

const ActionBarContentText = ({ children, ...props }) => (
  <div className={styles.ActionBarContentText} {...props}>
    {children}
  </div>
);

const getStargazersGitHub = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.github.com/repos/cybercongress/cyb',
    });

    return response.data;
  } catch (e) {
    return null;
  }
};

const StargazersCountGH = () => {
  const { data } = useQuery({
    queryKey: ['stargazers_count'],
    queryFn: async () => {
      const responce = await getStargazersGitHub();

      if (responce !== null) {
        return responce;
      }

      return undefined;
    },
  });

  return (
    <div>
      {data !== undefined ? formatNumber(data.stargazers_count) : '...'}
    </div>
  );
};

export function GitHub() {
  const mediaQuery = useMediaQuery('(min-width: 768px)');

  if (!mediaQuery) {
    return (
      <div
        id="github-bar"
        style={{
          position: 'fixed',
          right: '0',
          bottom: 0,
          margin: '0px 20px 28px 0px',
          fontSize: '14px',
          background: '#000c',
          zIndex: 4,
        }}
      >
        <LinkWindow to="https://github.com/cybercongress">
          <div>
            <img alt="github" style={{ width: 30, height: 30 }} src={github} />
          </div>
        </LinkWindow>
      </div>
    );
  }

  return (
    <div
      id="github-bar"
      style={{
        position: 'fixed',
        right: '0',
        bottom: 0,
        margin: '0px 20px 28px 0px',
        fontSize: '14px',
        background: '#000c',
        zIndex: 4,
      }}
    >
      <Tooltip
        placement="left"
        hideBorder
        tooltip={
          <div
            id="github-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              background: '#000c',
              padding: 5,
              marginRight: 15,
            }}
          >
            <LinkWindow to="https://github.com/cybercongress/cyb">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#36D6AE',
                  whiteSpace: 'nowrap',
                }}
              >
                join devs{' '}
                <img
                  alt="share"
                  style={{ width: 20, height: 20 }}
                  src={share}
                />
              </div>
            </LinkWindow>
            <LinkWindow to="https://github.com/cybercongress/cyb/issues/new">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#36D6AE',
                  whiteSpace: 'nowrap',
                }}
              >
                submit issue{' '}
                <img
                  alt="share"
                  style={{ width: 20, height: 20 }}
                  src={share}
                />
              </div>
            </LinkWindow>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '30px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgb(40, 40, 40)',
                  padding: '5px',
                  height: '100%',
                  borderRadius: '5px 0px 0px 5px',
                  borderRight: '1px solid #cccc',
                }}
              >
                <img alt="star" style={{ width: 20, height: 20 }} src={star} />
                Star
              </div>
              <div
                style={{
                  backgroundColor: 'rgb(17, 20, 30)',
                  padding: '5px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '0px 5px 5px 0',
                }}
              >
                {' '}
                <StargazersCountGH />
              </div>
            </div>
          </div>
        }
      >
        <LinkWindow to="https://github.com/cybercongress">
          <div>
            <img alt="github" style={{ width: 30, height: 30 }} src={github} />
          </div>
        </LinkWindow>
      </Tooltip>
    </div>
  );
}

export const Telegram = () => {
  const mediaQuery = useMediaQuery('(min-width: 768px)');

  if (!mediaQuery) {
    return (
      <div
        // id="github-bar"
        style={{
          position: 'fixed',
          left: '0',
          bottom: 0,
          margin: '0px 0px 28px 20px',
          fontSize: '14px',
          background: '#000c',
          zIndex: 4,
          marginLeft: 15,
        }}
      >
        <LinkWindow to="https://t.me/cyber/47896">
          <div>
            <img
              alt="telegram"
              style={{ width: 30, height: 30 }}
              src={telegram}
            />
          </div>
        </LinkWindow>
      </div>
    );
  }

  return (
    <div
      // id="github-bar"
      style={{
        position: 'fixed',
        left: '0',
        bottom: 0,
        margin: '0px 0px 28px 20px',
        fontSize: '14px',
        background: '#000c',
        zIndex: 4,
        marginLeft: 15,
      }}
    >
      <Tooltip
        hideBorder
        placement="right"
        tooltip={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              gap: '20px',
              background: '#000c',
              padding: 5,
            }}
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
                <img
                  alt="share"
                  style={{ width: 20, height: 20 }}
                  src={share}
                />
              </div>
            </LinkWindow>
            <LinkWindow to="https://t.me/cyber/47885">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#36D6AE',
                  whiteSpace: 'nowrap',
                }}
              >
                join movement{' '}
                <img
                  alt="share"
                  style={{ width: 20, height: 20 }}
                  src={share}
                />
              </div>
            </LinkWindow>
          </div>
        }
      >
        <LinkWindow to="https://t.me/cyber/47896">
          <div>
            <img
              alt="telegram"
              style={{ width: 30, height: 30 }}
              src={telegram}
            />
          </div>
        </LinkWindow>
      </Tooltip>
    </div>
  );
};

function ActionBar({
  children,
  btnText,
  onClickFnc,
  onClickBack,
  disabled,
  gridGap,
}) {
  return (
    <ActionBarContainer>
      {/* <Telegram /> */}
      {onClickBack && (
        <ButtonIcon
          styleContainer={{ position: 'absolute', left: '0' }}
          style={{ padding: 0 }}
          img={back}
          onClick={onClickBack}
          text="previous step"
        />
      )}
      {btnText && (
        <BtnGrd disabled={disabled} onClick={onClickFnc} text={btnText} />
      )}
      <ActionBarContentText
        gridGap={gridGap}
        //  marginLeft={onClickBack ? 30 : 0}
      >
        {children}
      </ActionBarContentText>
      {/* <GitHub /> */}
    </ActionBarContainer>
  );
}

export default ActionBar;
