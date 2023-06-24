/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unused-modules */
import axios from 'axios';

// https://platform.openai.com/docs/models/overview
// gpt-3.5-turbo

const API_KEY = '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';

// https://platform.openai.com/docs/api-reference/chat/create
export const promptToOpenAI = async (
  prompt: string,
  model = 'text-davinci-003', // 'gpt-3.5-turbo',
  maxTokens = 50,
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
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  console.log('response', response);
  return response.data.choices[0].text;
};
