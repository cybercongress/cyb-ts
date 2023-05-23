import Button from '../btnGrd';
import styles from './styles.scss';

import ButtonIcon from '../buttons/ButtonIcon';
import React from 'react';
import { $TsFixMeFunc } from 'src/types/tsfix';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { useGetPassportByAddress } from 'src/containers/sigma/hooks';
import { routes } from 'src/routes';
import { CYBER } from 'src/utils/config';
import { useLocation } from 'react-router-dom';
import { Networks } from 'src/types/networks';

const back = require('../../image/arrow-left-img.svg');

function ActionBarContainer({ children }) {
  return (
    <div className={styles.ActionBarContainer}>
      <div className={styles.ActionBarContainerContent}>{children}</div>
    </div>
  );
}

function ActionBarContentText({ children, ...props }) {
  return (
    <div className={styles.ActionBarContentText} {...props}>
      {children}
    </div>
  );
}

type Props = {
  children?: React.ReactNode;
  onClickBack?: $TsFixMeFunc;
  text?: string | React.ReactNode;
  button?: {
    text: string | React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  };
};

function ActionBar({ children, text, onClickBack, button }: Props) {
  const { defaultAccount } = useSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);
  const location = useLocation();

  const noAccount = !defaultAccount.account;
  const noPassport = CYBER.CHAIN_ID === Networks.BOSTROM && !passport;

  // TODO: not show while loading passport

  if ((noAccount || noPassport) && location.pathname !== routes.robot.path) {
    return (
      <ActionBarContainer>
        {noAccount && <Button link={routes.robot.path}>Connect</Button>}

        {noPassport && location.pathname !== routes.citizenship.path && (
          <Button link={routes.portal.path}>Get citizenship</Button>
        )}
      </ActionBarContainer>
    );
  }

  const content = text || children;

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

      {content && <ActionBarContentText>{content}</ActionBarContentText>}

      {button?.text && (
        <Button disabled={button.disabled} onClick={button.onClick}>
          {button.text}
        </Button>
      )}
      {/* <GitHub /> */}
    </ActionBarContainer>
  );
}

export default ActionBar;
