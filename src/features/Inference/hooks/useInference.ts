import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { InferenceItem } from '../type';

export type InferenceResponse = {
  result: InferenceItem[];
  time: number;
};

const inferenceFetcher = async (hash: string) => {
  return axios({
    method: 'get',
    url: `https://st-inference.cybernode.ai/standard_inference?particle=${hash}`,
  })
    .then((response) => response.data as InferenceResponse)
    .catch((e) => console.error(e));
};

function useInference(hash: string) {
  const { data, isFetching, error } = useQuery(
    ['useInference', hash],
    () => inferenceFetcher(hash),
    { enabled: Boolean(hash.length) }
  );

  return { data, isFetching, error };
}

export default useInference;
