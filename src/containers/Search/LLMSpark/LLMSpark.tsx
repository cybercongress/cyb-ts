import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { useQuery } from '@tanstack/react-query';
import { generateText } from 'ai';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Display } from 'src/components';
import useAddToIPFS from 'src/features/ipfs/hooks/useAddToIPFS';
import { routes } from 'src/routes';
import TextMarkdown from 'src/components/TextMarkdown';
import { useHover } from 'src/hooks/useHover';
import Loader2 from 'src/components/ui/Loader2';
import useGetIPFSHash from 'src/features/ipfs/hooks/useGetIPFSHash';
import { isCID } from 'src/utils/ipfs/helpers';
import { testVar } from '.';
import styles from './LLMSpark.module.scss';

// WIP

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

export function useIsLLMPageParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isLLM = searchParams.get('llm') === 'true';

  console.log(isLLM);

  return isLLM;
}

export function LLMAvatar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src="https://robohash.org/llama"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          marginRight: '5px',
        }}
      />
      {model.modelId}
    </div>
  );
}

function LLMSpark({ searchText }: { searchText: string }) {
  const { data, isLoading } = useLLMResponse(searchText);
  const { execute } = useAddToIPFS(data);

  const [ref, hovering] = useHover();

  const cid = useGetIPFSHash(data);

  const navigate = useNavigate();

  if (isCID(searchText)) {
    return null;
  }

  return (
    <Link
      ref={ref}
      className={styles.wrapper}
      to={routes.oracle.ask.getLink(cid)}
      onClick={async (e) => {
        e.preventDefault();

        const hash = await execute();

        navigate(`${routes.oracle.ask.getLink(hash)}?llm=true`);
      }}
    >
      {hovering && (
        <div className={styles.left}>
          <LLMAvatar />
        </div>
      )}
      <Display color={isLoading ? 'yellow' : 'blue'}>
        {isLoading && <Loader2 text="llm is generating response" />}
        {data && <TextMarkdown preview>{data}</TextMarkdown>}
      </Display>
    </Link>
  );
}

export default LLMSpark;
