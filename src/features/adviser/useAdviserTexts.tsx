import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAdviser, useSetAdviser } from 'src/features/adviser/context';
import { routes } from 'src/routes';
import { Dots } from 'src/components';
import useId from '../cybernet/_move/useId';

type Props =
  | {
      isLoading?: boolean;
      loadingText?: string;
      error?: string | undefined;
      defaultText?: string;
      successText?: string;
      txHash?: string;
    }
  | undefined;

function useAdviserTexts(
  {
    isLoading,
    error,
    defaultText,
    txHash,
    loadingText,
    successText,
    priority,
  } = {} as Props
) {
  const setAdviserNew = useSetAdviser();

  const [messageShowed, setMessageShowed] = useState(false);

  const set2 = useCallback(() => {
    setTimeout(() => {
      setMessageShowed(true);
    }, 4 * 1000);
  }, [setMessageShowed]);

  const key = useId();

  useEffect(() => {
    let adviserText = '';
    let color;

    if (error && !messageShowed) {
      adviserText = (
        <p>
          {error}{' '}
          {txHash && (
            <Link to={routes.txExplorer.getLink(txHash)}>check tx</Link>
          )}
        </p>
      );
      color = 'red';
    } else if (isLoading) {
      adviserText = loadingText ? (
        <>
          {loadingText}
          <Dots />
        </>
      ) : (
        'Loading...'
      );
      color = 'yellow';
    } else if (successText && !messageShowed) {
      adviserText = successText;
      color = 'green';
    } else {
      adviserText = defaultText || '';
    }

    setAdviserNew(key, adviserText, color, priority);

    if (!messageShowed && (error || successText)) {
      set2();
    }
  }, [
    setAdviserNew,
    set2,
    priority,
    isLoading,
    error,
    defaultText,
    messageShowed,
    txHash,
    key,
    loadingText,
    successText,
  ]);

  const setAdviser = useCallback(
    (content: string, color: string) => {
      setAdviserNew(key, content, color);
    },
    [setAdviserNew, key]
  );

  useEffect(() => {
    return () => {
      setAdviserNew(key, null);
    };
  }, [setAdviserNew, key]);

  return {
    setAdviser,
  };
}

export default useAdviserTexts;
