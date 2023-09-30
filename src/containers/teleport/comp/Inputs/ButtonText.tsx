import React from 'react';
import cx from 'classnames';
import { TypeRecipient } from './type';
import styles from './styles.module.scss';

type Props = {
  active: boolean;
  text: TypeRecipient;
  onClick: React.Dispatch<React.SetStateAction<TypeRecipient>>;
};

export default function ButtonText({ onClick, text, active }: Props) {
  return (
    <button
      type="button"
      className={cx(styles.ButtonText, {
        [styles.ButtonTextActive]: active,
      })}
      onClick={() => onClick(TypeRecipient.friends)}
    >
      {text}
    </button>
  );
}
