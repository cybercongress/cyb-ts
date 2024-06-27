import { useCybernet } from './cybernet.context';
import { texts, Texts } from './cybernetTexts';
import { useCallback } from 'react';

function useCybernetTexts() {
  const { selectedContract } = useCybernet();

  const type = selectedContract?.metadata?.name === 'graph' ? 'graph' : 'ml';

  const getText = useCallback(
    (key: Texts, isPlural?: boolean) => {
      const t = type === 'graph' ? 'graph' : 'default';
      const t2 = texts[key][t];

      let text: string;

      // refactor
      if (typeof t2 === 'object') {
        text = isPlural ? t2.plural || t2 + 's' : t2.single || t2;
      } else {
        text = t2;
        if (isPlural) {
          text += 's';
        }
      }

      return text;
    },
    [type]
  );

  return {
    getText,
  };
}

export default useCybernetTexts;
