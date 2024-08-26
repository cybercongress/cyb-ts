import { ReactNode } from 'react';
import styles from './KeywordButton.module.scss';
import { Tooltip } from 'src/components';

type Props = {
  text: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
};

function KeywordButton({ text, onClick, disabled, tooltip }: Props) {
  return (
    <Tooltip tooltip={!disabled && tooltip}>
      <button
        className={styles.keywordBtn}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {text}
      </button>
    </Tooltip>
  );
}

export default KeywordButton;
