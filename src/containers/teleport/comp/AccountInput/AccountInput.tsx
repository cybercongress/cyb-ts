import React, { useCallback, useState } from 'react';
import { Account, Input } from 'src/components';
import LinearGradientContainer, {
  Color,
} from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { PATTERN_CYBER } from 'src/utils/config';

type Props = {
  recipient: string;
  onChangeRecipient: React.Dispatch<React.SetStateAction<string>>;
};

function AccountInput({ recipient, onChangeRecipient }: Props) {
  const [focused, setFocused] = useState(false);

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
        style={{ height: '42px', background: 'transparent', border: 'none' }}
      >
        <LinearGradientContainer color={Color.Green} title="choose recipient">
          <Account avatar address={recipient} />
        </LinearGradientContainer>
      </button>
    );
  }

  return (
    <Input
      id="recipient"
      value={recipient}
      onChange={(e) => onChangeRecipient(e.target.value)}
      title="choose recipient"
      color={Color.Green}
      onBlurFnc={() => onBlurInput()}
      // onClick={}
    />
  );
}

export default AccountInput;
