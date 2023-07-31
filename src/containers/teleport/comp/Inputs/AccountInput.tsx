import React, { useCallback, useEffect, useState } from 'react';
import { Account, Input } from 'src/components';
import LinearGradientContainer, {
  Color,
} from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { PATTERN_CYBER } from 'src/utils/config';
import styles from './styles.module.scss';

type Props = {
  recipient: string;
  valueRecipient: string;
  onChangeRecipient: React.Dispatch<React.SetStateAction<string>>;
};

const AccountInput = React.forwardRef<HTMLInputElement, Props>(
  ({ recipient, valueRecipient, onChangeRecipient }, ref) => {
    const [focused, setFocused] = useState(false);

    useEffect(() => {
      onBlurInput();
    }, [recipient]);

    const onBlurInput = useCallback(() => {
      if (recipient && recipient.length && recipient.match(PATTERN_CYBER)) {
        setFocused(true);
      }
    }, [recipient]);

    if (focused) {
      return (
        <button
          type="button"
          onClick={() => setFocused(false)}
          className={styles.containerBtnValue}
        >
          <LinearGradientContainer color={Color.Green} title="choose recipient">
            <Account avatar address={recipient} />
          </LinearGradientContainer>
        </button>
      );
    }

    return (
      <Input
        ref={ref}
        id="recipient"
        value={valueRecipient}
        onChange={(e) => onChangeRecipient(e.target.value)}
        title="choose recipient"
        color={Color.Green}
        classNameTextbox={styles.contentValueInput}
        onBlurFnc={() => onBlurInput()}
        // onClick={}
      />
    );
  }
);

AccountInput.displayName = 'AccountInput';

export default AccountInput;
