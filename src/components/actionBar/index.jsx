import React from 'react';
import { ButtonIcon } from '../ledger/stageActionBar';
import BtnGrd from '../btnGrd';
import styles from './styles.scss';

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
    </ActionBarContainer>
  );
}

export default ActionBar;
