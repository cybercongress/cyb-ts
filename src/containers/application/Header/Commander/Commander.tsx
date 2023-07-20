import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { replaceSlash } from '../../../../utils/utils';
import { Input } from '../../../../components';
import styles from './Commander.module.scss';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { useDispatch } from 'react-redux';
import { setContext } from 'src/redux/features/scripting';

const fixedValue = '~/';

function Commander() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { query } = useParams();
  const location = useLocation();

  const [search, setSearch] = useState(fixedValue + (query || ''));

  const ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (
        event.key === '/' &&
        ref.current &&
        ref.current !== document.activeElement
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

  useEffect(() => {
    // pass context to scripting
    dispatch(
      setContext({
        name: 'params',
        item: {
          path: location.pathname.split('/').slice(1),
          query: query || '',
          search: Object.fromEntries(new URLSearchParams(location.search)),
        },
      })
    );
  }, [query, location, dispatch]);

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

    navigate(`/search/${replaceSlash(search.replace(fixedValue, ''))}`);
  }

  return (
    <form className={styles.wrapper} onSubmit={submit}>
      <Input
        ref={ref}
        color={Color.Pink}
        value={search}
        onChange={onChange}
        autoFocus={window.self === window.top}
        className={styles.input}
        autoComplete="off"
      />
    </form>
  );
}

export default Commander;
