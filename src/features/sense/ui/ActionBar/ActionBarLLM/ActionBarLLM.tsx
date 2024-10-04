import { useState } from 'react';
import { ActionBar, Button, Input } from 'src/components';
import { llmRequest } from 'src/containers/Search/LLMSpark/LLMSpark';

function ActionBarLLM() {
  const [text, setText] = useState('');

  const content = (
    <>
      <Input
        placeholder="Ask the model"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        onClick={async () => {
          const d = await llmRequest(text);

          alert(d);
        }}
      >
        Ask
      </Button>
    </>
  );
  return <ActionBar>{content}</ActionBar>;
}

export default ActionBarLLM;
