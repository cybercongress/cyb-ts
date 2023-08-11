/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unused-modules */
import axios from 'axios';

// https://platform.openai.com/docs/models/overview
// gpt-3.5-turbo

const API_KEY = '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';

// https://platform.openai.com/docs/api-reference/chat/create
export const promptToOpenAI = async (
  prompt: string,
  apiKey = API_KEY,
  model = 'text-davinci-003', // 'gpt-3.5-turbo',
  maxTokens = 500,
  stop = '.',
  n = 1
) => {
  //prompt: `Complete this sentence: "${input}"`,
  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      prompt,
      model,
      max_tokens: maxTokens,
      n,
      stop,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  console.log('response', response);
  return response.data.choices[0].text;
};
