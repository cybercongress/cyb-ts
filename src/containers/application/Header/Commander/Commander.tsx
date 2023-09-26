import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { replaceSlash } from '../../../../utils/utils';
import { Input } from '../../../../components';
import styles from './Commander.module.scss';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { routes } from 'src/routes';

const fixedValue = '~/';

// replace with more declarative way
export const id = 'commander';

function Commander() {
  const navigate = useNavigate();
  const { query: q, cid } = useParams();
  const query = q || cid;
  const [search, setSearch] = useState(fixedValue + (query || ''));

  const ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (
        event.key === '/' &&
        ref.current &&
        ref.current !== document.activeElement &&
        event.target &&
        !['INPUT', 'TEXTAREA'].includes(event.target.tagName)
      ) {
        event.preventDefault();
        ref.current.focus();
      }
    }

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    setSearch(fixedValue + (query || ''));
  }, [query]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    let newValue = value;

    if (value.length < fixedValue.length) {
      newValue = fixedValue;
    } else if (!value.startsWith(fixedValue)) {
      newValue = fixedValue + value;
    }

    setSearch(newValue);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!search || search === fixedValue) {
      return;
    }

    navigate(
      routes.search.getLink(replaceSlash(search.replace(fixedValue, '')))
    );
  }

  return (
    <form className={styles.wrapper} onSubmit={submit}>
      <Input
        ref={ref}
        color={Color.Pink}
        value={search}
        id={id}
        onChange={onChange}
        autoFocus={window.self === window.top}
        className={styles.input}
        autoComplete="off"
      />
    </form>
  );
}

export default Commander;
