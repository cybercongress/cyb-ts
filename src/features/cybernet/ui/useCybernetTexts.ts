import { useCybernet } from './cybernet.context';
import { texts, Texts } from './cybernetTexts';

function useCybernetTexts() {
  const { selectedContract } = useCybernet();

  const type = selectedContract?.metadata?.name === 'graph' ? 'graph' : 'ml';

  function getText(key: Texts, isPlural?: boolean) {
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
  }

  return {
    getText,
  };
}

export default useCybernetTexts;
