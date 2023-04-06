import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { replaceSlash } from '../../../../utils/utils';
import { Input } from '../../../../components';
import styles from './Commander.module.scss';

function Commander() {
  const navigate = useNavigate();
  const { query } = useParams();
  const [search, setSearch] = useState(query || '');

  useEffect(() => {
    setSearch(query || '');
  }, [query]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!search) {
      return;
    }

    navigate(`/search/${replaceSlash(search)}`);
  }

  return (
    <form className={styles.wrapper} onSubmit={submit}>
      <Input
        color="pink"
        name="search"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        style={{ textAlign: 'center', fontSize: 24 }}
        autoComplete="off"
      />
    </form>
  );
}

export default Commander;
