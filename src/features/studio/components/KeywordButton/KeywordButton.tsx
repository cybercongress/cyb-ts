import { ReactNode } from 'react';
import cx from 'classnames';
import { Tooltip } from 'src/components';
import styles from './KeywordButton.module.scss';

type Props = {
  text: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
  isKeyword?: boolean;
  className?: string;
};

function KeywordButton({
  text,
  onClick,
  disabled,
  tooltip,
  isKeyword,
  className,
}: Props) {
  return (
    <Tooltip tooltip={!disabled && tooltip}>
      <button
        className={cx(styles.keywordBtn, className, {
          [styles.isKeyword]: isKeyword,
        })}
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
