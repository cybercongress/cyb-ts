import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { routes } from 'src/routes';
import { getIpfsHash } from 'src/utils/search/utils';
import { PATTERN_IPFS_HASH } from 'src/utils/config';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setFocus, setValue } from './commander.redux';
import styles from './Commander.module.scss';
import { Input } from '../../../../components';
import { encodeSlash, replaceSlash } from '../../../../utils/utils';

const fixedValue = '~';

function Commander() {
  const navigate = useNavigate();
  const { query: q, cid } = useParams();
  const query = q || cid;

  const commander = useAppSelector((store) => store.commander);
  const dispatch = useAppDispatch();

  const commanderRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (
        event.key === '/' &&
        commanderRef.current &&
        commanderRef.current !== document.activeElement &&
        event.target &&
        !['INPUT', 'TEXTAREA'].includes(event.target.tagName)
      ) {
        event.preventDefault();
        commanderRef.current.focus();
      }
    }

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  // focus hook
  useEffect(() => {
    if (!commanderRef.current) {
      return;
    }

    function onFocus() {
      dispatch(setFocus(true));
    }

    function onBlur(e) {
      if (e.relatedTarget?.tagName.toLowerCase() === 'a') {
        e.relatedTarget.click();
      }

      dispatch(setFocus(false));
    }

    commanderRef.current.addEventListener('focus', onFocus);
    commanderRef.current.addEventListener('blur', onBlur);

    return () => {
      if (!commanderRef.current) {
        return;
      }

      commanderRef.current.removeEventListener('focus', onFocus);
      commanderRef.current.removeEventListener('blur', onBlur);
    };
  }, [commanderRef, dispatch]);

  useEffect(() => {
    (async () => {
      let newValue = query || '';

      if (query && !query.match(PATTERN_IPFS_HASH)) {
        newValue = (await getIpfsHash(encodeSlash(query))) as string;
      }

      dispatch(setValue(newValue));
    })();
  }, [query, dispatch]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    dispatch(setValue(value.replace(fixedValue, '')));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { value } = commander;

    if (!value) {
      return;
    }

    navigate(routes.search.getLink(replaceSlash(value)));
    dispatch(setFocus(false));
  }

  return (
    <form className={styles.wrapper} onSubmit={submit}>
      <Input
        ref={commanderRef}
        color={Color.Pink}
        value={fixedValue + commander.value}
        focusedProps={commander.isFocused}
        // placeholder="Ask me anything"
        onChange={onChange}
        // autoFocus={window.self === window.top}
        className={styles.input}
        autoComplete="off"
      />
    </form>
  );
}

export default Commander;
