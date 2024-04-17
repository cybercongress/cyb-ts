import { useEffect } from 'react';

import { useAdviser } from 'src/features/adviser/context';

type Props = {
  isLoading?: boolean;
  error?: string | undefined;
  defaultText?: string;
};

function useAdviserTexts({ isLoading, error, defaultText }: Props) {
  const { setAdviser } = useAdviser();

  useEffect(() => {
    let adviserText = '';
    let color;

    if (error) {
      adviserText = error;
      color = 'red';
    } else if (isLoading) {
      adviserText = 'Loading...';
      color = 'yellow';
    } else {
      adviserText = defaultText || '';
    }

    console.log('adviserText', adviserText);

    setAdviser(adviserText, color);
  }, [setAdviser, isLoading, error, defaultText]);

  return null;
}

export default useAdviserTexts;
