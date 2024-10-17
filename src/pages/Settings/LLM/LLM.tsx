import { Display } from 'src/components';
import { LLMAvatar } from 'src/containers/Search/LLMSpark/LLMSpark';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';

function LLM() {
  useAdviserTexts({
    defaultText: 'LLM setting',
  });
  return (
    <Display>
      LLM
      <LLMAvatar />
    </Display>
  );
}

export default LLM;
