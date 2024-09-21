import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionBar, Color, Input } from 'src/components';
import { routes } from 'src/routes';
import { replaceSlash } from 'src/utils/utils';
import styles from './ActionBar.module.scss';

function ActionBarContainer() {
  const navigate = useNavigate();
  const [valueInput, setValueInput] = useState('');

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    navigate(routes.inference.getLink(replaceSlash(valueInput)));
  }

  return (
    <ActionBar>
      <form className={styles.inputContainer} onSubmit={submit}>
        <Input
          color={Color.Pink}
          autoComplete="off"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          className={styles.input}
        />
      </form>
    </ActionBar>
  );
}

export default ActionBarContainer;
