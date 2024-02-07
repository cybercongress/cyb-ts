import React from 'react';
import { $TsFixMeFunc } from 'src/types/tsfix';

import { routes } from 'src/routes';
import { CYBER } from 'src/utils/config';
import { useLocation } from 'react-router-dom';
import { Networks } from 'src/types/networks';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import ButtonIcon from '../buttons/ButtonIcon';
import styles from './styles.module.scss';
import Button from '../btnGrd';

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
    onClick?: () => void;
    link?: string;
    disabled?: boolean;
  };
};

function ActionBar({ children, text, onClickBack, button }: Props) {
  const location = useLocation();

  const { defaultAccount, commander } = useAppSelector((store) => {
    return {
      defaultAccount: store.pocket.defaultAccount,
      commander: store.commander,
    };
  });

  const address = useAppSelector(selectCurrentAddress);
  const { passport } = usePassportByAddress(address);

  const noAccount = !defaultAccount.account;
  const noPassport = CYBER.CHAIN_ID === Networks.BOSTROM && !passport;

  // TODO: not show while loading passport

  if (commander.isFocused) {
    return (
      <ActionBarContainer>
        <Button
          link={routes.search.getLink(commander.value)}
          disabled={!commander.value.length}
        >
          Ask
        </Button>
      </ActionBarContainer>
    );
  }

  if (
    (noAccount || noPassport) &&
    // maybe change to props
    ((location.pathname !== routes.keys.path &&
      !location.pathname.includes('/drive') &&
      !location.pathname.includes('/oracle') &&
      location.pathname !== '/') ||
      location.pathname === '/oracle/learn')
  ) {
    return (
      <ActionBarContainer>
        {noAccount && <Button link={routes.keys.path}>Connect</Button>}

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
        <Button
          disabled={button.disabled}
          link={button.link}
          onClick={button.onClick}
        >
          {button.text}
        </Button>
      )}
      {/* <GitHub /> */}
    </ActionBarContainer>
  );
}

export default ActionBar;
