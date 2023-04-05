import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { replaceSlash } from '../../../../utils/utils';
import { Input } from '../../../../components';
import styles from './Commander.module.scss';

function Commander() {
  const navigate = useNavigate();
  const { query } = useParams();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // @ts-ignore
    const value = event.target.search.value;
    if (!value) {
      return;
    }

    navigate(`/search/${replaceSlash(value)}`);
  }

  return (
    <form className={styles.wrapper} onSubmit={submit}>
      <Input
        color="pink"
        name="search"
        defaultValue={query || ''}
        style={{ textAlign: 'center', fontSize: 24 }}
        autoComplete="off"
      />
    </form>
  );
}

export default Commander;
