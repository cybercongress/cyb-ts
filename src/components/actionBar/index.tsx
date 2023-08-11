import React from 'react';
import { $TsFixMeFunc } from 'src/types/tsfix';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { routes } from 'src/routes';
import { CYBER } from 'src/utils/config';
import { useLocation } from 'react-router-dom';
import { Networks } from 'src/types/networks';
import ButtonIcon from '../buttons/ButtonIcon';
import styles from './styles.module.scss';
import Button from '../btnGrd';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';

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

type ButtonType = {
  text: string | React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export type Props = {
  children?: React.ReactNode;
  onClickBack?: $TsFixMeFunc;
  text?: string | React.ReactNode;
  button?: ButtonType;

  // maybe will be refactored
  additionalButtons?: ButtonType[];
};

function ActionBar({
  children,
  text,
  onClickBack,
  button,
  additionalButtons,
}: Props) {
  const location = useLocation();

  const { defaultAccount } = useSelector((store: RootState) => {
    return {
      defaultAccount: store.pocket.defaultAccount,
    };
  });

  const { passport } = usePassportByAddress(
    defaultAccount?.account?.cyber?.bech32 || null
  );

  const noAccount = !defaultAccount.account;
  const noPassport = CYBER.CHAIN_ID === Networks.BOSTROM && !passport;

  // TODO: not show while loading passport

  if ((noAccount || noPassport) && location.pathname !== routes.keys.path) {
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

  const isButton = !!button;

  function withForm(children: React.ReactNode) {
    if (isButton) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            button.onClick();
          }}
        >
          {children}
        </form>
      );
    }

    return children;
  }

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

      {withForm(
        <>
          {content && <ActionBarContentText>{content}</ActionBarContentText>}

          {additionalButtons &&
            additionalButtons.map((item, index) => (
              <Button
                key={index}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.text}
              </Button>
            ))}

          {isButton && (
            <Button type="submit" disabled={button.disabled}>
              {button.text}
            </Button>
          )}
        </>
      )}

      {/* <GitHub /> */}
    </ActionBarContainer>
  );
}

export default ActionBar;
