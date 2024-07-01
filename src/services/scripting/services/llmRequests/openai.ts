/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unused-modules */
import axios, { ResponseType } from 'axios';

// https://platform.openai.com/docs/models/overview
// gpt-3.5-turbo

type OpenAiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

interface OpenAIParams {
  model: string;
  messages: OpenAiMessage[];
  [key: string]: any;
}

const defaultOpenAIParams: Partial<OpenAIParams> = {
  model: 'gpt-3.5-turbo',
};

export const openAICompletion = async (
  messages: OpenAiMessage[],
  apiKey: string,
  params: Partial<OpenAIParams> = {}
): Promise<string | AsyncIterable<string>> => {
  const requestOptions = {
    method: 'post',
    url: 'https://api.openai.com/v1/chat/completions',
    data: {
      messages,
      ...defaultOpenAIParams,
      ...params,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    responseType: (params.stream ? 'stream' : 'json') as ResponseType,
  };

  const response = await axios(requestOptions);

  if (!params.stream) {
    // Non-streaming request
    console.log('response', response);
    return response.data.choices[0].message.content;
  } else {
    // Streaming request
    const asyncIterable: AsyncIterable<string> = {
      [Symbol.asyncIterator]: async function* () {
        let result = '';
        for await (const chunk of response.data) {
          const str = chunk.toString();
          const lines = str.split('\n').filter((line) => line.trim() !== '');
          for (const line of lines) {
            const message = line.replace(/^data: /, '');
            if (message === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(message);
              result += parsed.choices[0].delta.content;
              yield parsed.choices[0].delta.content;
            } catch (error) {
              console.error('Error parsing stream message:', message, error);
            }
          }
        }
      },
    };

    return asyncIterable;
  }
};
