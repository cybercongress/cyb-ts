import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'src/components';
import ActionBarContainer, {
  Props as ActionBarProps,
} from 'src/components/actionBar';
import { setSecrets } from 'src/redux/features/scripting';
import { RootState } from 'src/redux/store';
import { v4 as uuidv4 } from 'uuid';

enum Steps {
  INIT_STATE,
  CHOICE_ACTION,
  EDIT_SECRET,
  ADD_SECRET,
  REMOVE_SECRET,
}

type Props = {
  selected?: string;
  callback: () => void;
};

const INITIAL_STATE = {
  key: '',
  value: '',
};

function ActionBar({ selected, callback }: Props) {
  const [step, setStep] = useState(Steps.INIT_STATE);
  const { secrets } = useSelector(
    (store: RootState) => store.scripting.context
  );
  const dispatch = useDispatch();

  const [newSecret, setNewSecret] = useState(INITIAL_STATE);

  let button: ActionBarProps['button'];
  let content: ActionBarProps['children'];
  let additionalButtons: ActionBarProps['additionalButtons'];

  function handleSecretChange(value: string, name: keyof typeof newSecret) {
    setNewSecret({ ...newSecret, [name]: value });
  }

  useEffect(() => {
    if (selected) {
      setStep(Steps.CHOICE_ACTION);
    } else {
      setStep(Steps.INIT_STATE);
    }

    setNewSecret(INITIAL_STATE);
  }, [selected]);

  useEffect(() => {
    if (!selected || step !== Steps.EDIT_SECRET) {
      return;
    }
    const secret = secrets[selected];

    if (!secret) {
      return;
    }

    setNewSecret(secret);
  }, [selected, step, secrets]);

  const inputs = (
    <>
      <Input
        value={newSecret.key}
        autoFocus
        onChange={(e) => handleSecretChange(e.target.value, 'key')}
        placeholder="Key"
      />
      <Input
        // isTextarea
        value={newSecret.value}
        onChange={(e) => handleSecretChange(e.target.value, 'value')}
        placeholder="Value"
      />
    </>
  );

  function handleSave() {
    const isNew = !selected;

    const newSecrets = { ...secrets };
    const key = isNew ? uuidv4() : selected;

    newSecrets[key] = newSecret;
    dispatch(setSecrets(newSecrets));
    setNewSecret(INITIAL_STATE);
    setStep(Steps.INIT_STATE);

    callback();
  }

  const buttonSaveConfig: ActionBarProps['button'] = {
    text: 'Save',
    disabled: !newSecret.key || !newSecret.value,
    onClick: handleSave,
  };

  switch (step) {
    case Steps.INIT_STATE:
      button = {
        text: 'Add secret',
        onClick: () => setStep(Steps.ADD_SECRET),
      };

      break;

    case Steps.ADD_SECRET:
      content = inputs;
      button = {
        ...buttonSaveConfig,
        onClick: handleSave,
      };

      break;

    case Steps.CHOICE_ACTION:
      button = {
        text: 'Remove',
        onClick: () => {
          setStep(Steps.REMOVE_SECRET);
        },
      };

      additionalButtons = [
        {
          text: 'Edit',
          onClick: () => {
            setStep(Steps.EDIT_SECRET);
          },
        },
      ];

      break;

    case Steps.EDIT_SECRET:
      content = inputs;

      button = {
        ...buttonSaveConfig,
        onClick: handleSave,
      };

      break;

    case Steps.REMOVE_SECRET:
      // should't be this, fot TS
      if (!selected) {
        break;
      }

      content = (
        <p>
          remove key <strong>{secrets[selected]?.key}</strong>?
        </p>
      );
      button = {
        text: 'Remove',
        onClick: () => {
          const newSecrets = { ...secrets };
          delete newSecrets[selected];
          dispatch(setSecrets(newSecrets));
          setStep(Steps.INIT_STATE);
          callback();
        },
      };

      break;

    default:
      break;
  }
  return (
    <ActionBarContainer button={button} additionalButtons={additionalButtons}>
      {content}
    </ActionBarContainer>
  );
}

export default ActionBar;
