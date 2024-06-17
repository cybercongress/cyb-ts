import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useAdviser } from 'src/features/adviser/context';
import { routes } from 'src/routes';
import { Dots } from 'src/components';

type Props = {
  isLoading?: boolean;
  loadingText?: string;
  error?: string | undefined;
  defaultText?: string;
  txHash?: string;
};

function useAdviserTexts({
  isLoading,
  error,
  defaultText,
  txHash,
  loadingText,
}: Props) {
  const { setAdviserNew } = useAdviser();

  const key = useRef(uuidv4()).current;

  useEffect(() => {
    let adviserText = '';
    let color;

    if (error) {
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
    } else {
      adviserText = defaultText || '';
    }

    setAdviserNew(key, adviserText, color);
  }, [setAdviserNew, isLoading, error, defaultText, txHash, key, loadingText]);

  useEffect(() => {
    return () => {
      setAdviserNew(key, null);
    };
  }, [setAdviserNew, key]);

  return null;
}

export default useAdviserTexts;
