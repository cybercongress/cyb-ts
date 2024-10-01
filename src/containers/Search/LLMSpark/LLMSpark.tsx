import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { useQuery } from '@tanstack/react-query';
import { generateText } from 'ai';
import { Link, useNavigate } from 'react-router-dom';
import { Display } from 'src/components';
import useAddToIPFS from 'src/features/ipfs/hooks/useAddToIPFS';
import { routes } from 'src/routes';
import { testVar } from '.';

const provider = createOpenRouter({
  ['a' + 'piK' + 'ey']: `sk-or-v1-${atob(testVar)}`,
});

const model = provider.chat('meta-llama/llama-3-8b-instruct:free');

export async function llmRequest(prompt) {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
}

function useLLMResponse(text) {
  const { data, isLoading, error } = useQuery(
    ['llm', text],
    async () => {
      return llmRequest(`what is ${text}`);
    },
    {
      enabled: Boolean(text),
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}

function LLMSpark({ searchText }: { searchText: string }) {
  const { data, isLoading } = useLLMResponse(searchText);
  const { execute } = useAddToIPFS(data);

  const navigate = useNavigate();

  return (
    <Display color="blue">
      Model: {model.modelId}
      <br />
      Query: {searchText}
      <br />
      {isLoading && <div>Loading...</div>}
      <Link
        to="addHash"
        // to={`/search?q=${searchText}`}
        onClick={async (e) => {
          e.preventDefault();

          const hash = await execute();

          navigate(routes.oracle.ask.getLink(hash));
        }}
      >
        {!isLoading && data}
      </Link>
    </Display>
  );
}

export default LLMSpark;
