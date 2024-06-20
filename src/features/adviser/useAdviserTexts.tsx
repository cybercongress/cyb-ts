import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useSetAdviser } from 'src/features/adviser/context';
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
  const { setAdviser } = useSetAdviser();

  const [messageShowed, setMessageShowed] = useState(false);

  const key = useId();

  const setAdviserFunc = useCallback(
    // use adviser props
    (content: string | Element, color?: string) => {
      setAdviser(key, content, color);
    },
    [setAdviser, key]
  );

  const set2 = useCallback(() => {
    setTimeout(() => {
      setMessageShowed(true);
    }, 4 * 1000);
  }, [setMessageShowed]);

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

    setAdviserFunc(adviserText, color, priority);

    if (!messageShowed && (error || successText)) {
      set2();
    }
  }, [
    setAdviserFunc,
    set2,
    priority,
    isLoading,
    error,
    defaultText,
    messageShowed,
    txHash,
    loadingText,
    successText,
  ]);

  useEffect(() => {
    return () => {
      setAdviserFunc(key, null);
    };
  }, [setAdviserFunc, key]);

  return {
    setAdviser: setAdviserFunc,
  };
}

export default useAdviserTexts;
