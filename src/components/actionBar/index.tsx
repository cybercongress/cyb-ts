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
  btnText?: string | React.ReactNode;
  onClickFnc?: $TsFixMeFunc;
  onClickBack?: $TsFixMeFunc;
  disabled?: boolean;
  text?: string | React.ReactNode;
  button?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
};

function ActionBar({
  children,
  btnText,
  text,
  onClickFnc,
  onClickBack,
  disabled,
  button,
}: Props) {
  const { defaultAccount } = useSelector((store: RootState) => store.pocket);
  const { passport } = useGetPassportByAddress(defaultAccount);
  const location = useLocation();

  const accountWithPassport = defaultAccount.account && passport;

  // TODO: not show while loading passport

  if (!accountWithPassport && location.pathname !== routes.robot.path) {
    return (
      <ActionBarContainer>
        {!defaultAccount.account && location.pathname !== routes.robot.path && (
          <Button link={routes.robot.path}>Connect</Button>
        )}

        {!passport &&
          CYBER.CHAIN_ID === Networks.BOSTROM &&
          location.pathname !== routes.citizenship.path && (
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

      {(btnText || button?.text) && (
        <Button
          disabled={disabled || button?.disabled}
          onClick={onClickFnc || button?.onClick}
        >
          {btnText || button?.text}
        </Button>
      )}
      {/* <GitHub /> */}
    </ActionBarContainer>
  );
}

export default ActionBar;
