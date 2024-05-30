import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAdviser } from 'src/features/adviser/context';
import { routes } from 'src/routes';

type Props = {
  isLoading?: boolean;
  error?: string | undefined;
  defaultText?: string;
  txHash?: string;
};

function useAdviserTexts({ isLoading, error, defaultText, txHash }: Props) {
  const { setAdviser } = useAdviser();

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
      adviserText = 'Loading...';
      color = 'yellow';
    } else {
      adviserText = defaultText || '';
    }

    setAdviser(adviserText, color);
  }, [setAdviser, isLoading, error, defaultText, txHash]);

  return null;
}

export default useAdviserTexts;
